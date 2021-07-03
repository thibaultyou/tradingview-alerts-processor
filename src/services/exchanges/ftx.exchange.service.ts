import { ExchangeId } from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { getAccountId } from '../../utils/account.utils';
import { Exchange, Ticker } from 'ccxt';
import {
  getInvertedTradeSide,
  getTradeSide,
  isSideDifferent
} from '../../utils/trading.utils';
import { Side } from '../../constants/trading.constants';
import { IOrderOptions } from '../../interfaces/trading.interfaces';
import {
  POSITIONS_READ_ERROR,
  POSITIONS_READ_SUCCESS,
  NO_CURRENT_POSITION,
  POSITION_READ_SUCCESS,
  TICKER_BALANCE_READ_ERROR,
  TICKER_BALANCE_READ_SUCCESS,
  BALANCES_READ_ERROR,
  BALANCES_READ_SUCCESS,
  AVAILABLE_FUNDS
} from '../../messages/exchanges.messages';
import { debug, error, info } from '../logger.service';
import {
  BalancesFetchError,
  ConversionError,
  PositionsFetchError,
  TickerFetchError
} from '../../errors/exchange.errors';
import { Trade } from '../../entities/trade.entities';
import {
  formatFTXSpotSymbol,
  isFTXSpot
} from '../../utils/exchanges/ftx.exchange.utils';
import {
  OPEN_TRADE_ERROR_MAX_SIZE,
  REVERSING_TRADE,
  TRADE_CALCULATED_SIZE,
  TRADE_CALCULATED_SIZE_ERROR,
  TRADE_ERROR_SIZE,
  TRADE_OVERFLOW
} from '../../messages/trading.messages';
import {
  NoOpenPositionError,
  OpenPositionError,
  OrderSizeError
} from '../../errors/trading.errors';
import { CompositeExchangeService } from './base/composite.exchange.service';
import {
  IFTXAccountInformations,
  IFTXBalance,
  IFTXFuturesPosition
} from '../../interfaces/exchanges/ftx.exchange.interfaces';
import { IBalance } from '../../interfaces/exchanges/common.exchange.interfaces';
import { TRADE_CALCULATED_OPEN_SIZE } from '../../messages/trading.messages';

export class FTXExchangeService extends CompositeExchangeService {
  constructor() {
    super(ExchangeId.FTX);
  }

  getBalances = async (
    account: Account,
    instance?: Exchange
  ): Promise<IBalance[]> => {
    const accountId = getAccountId(account);
    try {
      if (!instance) {
        instance = (await this.refreshSession(account)).exchange;
      }
      const balances = await instance.fetch_balance();
      debug(BALANCES_READ_SUCCESS(this.exchangeId, accountId));
      return balances.info.result
        .filter((b: IFTXBalance) => Number(b.total))
        .map((b: IFTXBalance) => ({
          coin: b.coin,
          free: b.free,
          total: b.total
        }));
    } catch (err) {
      error(BALANCES_READ_ERROR(this.exchangeId, accountId), err);
      throw new BalancesFetchError(
        BALANCES_READ_ERROR(this.exchangeId, accountId, err.message)
      );
    }
  };

  getTickerBalance = async (
    account: Account,
    ticker: Ticker
  ): Promise<number> => {
    const accountId = getAccountId(account);
    const symbol = formatFTXSpotSymbol(ticker.symbol);
    try {
      const balances = await this.getBalances(account);
      const balance = balances.filter((b) => b.coin === symbol).pop();
      const size = Number(balance.free);
      debug(
        TICKER_BALANCE_READ_SUCCESS(this.exchangeId, accountId, symbol, balance)
      );
      return size;
    } catch (err) {
      error(TICKER_BALANCE_READ_ERROR(this.exchangeId, accountId, symbol, err));
      throw new TickerFetchError(
        TICKER_BALANCE_READ_ERROR(this.exchangeId, accountId, symbol, err)
      );
    }
  };

  getCloseOrderOptions = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<IOrderOptions> => {
    let options: IOrderOptions = {
      size: 0,
      side: 'sell'
    };
    // we add a check since FTX is a composite exchange
    if (isFTXSpot(ticker)) {
      const balance = await this.getTickerBalance(account, ticker);
      if (balance) {
        options = {
          side: Side.Sell,
          size: this.getCloseOrderSize(ticker, trade.size, balance)
        };
      }
    } else {
      const position = await this.getTickerPosition(account, ticker);
      if (position) {
        options = {
          size: this.getCloseOrderSize(
            ticker,
            trade.size,
            Number(position.size)
          ),
          side: getInvertedTradeSide(position.side as Side)
        };
      }
    }
    return options;
  };

  getTickerPosition = async (
    account: Account,
    ticker: Ticker
  ): Promise<IFTXFuturesPosition> => {
    const { symbol } = ticker;
    const accountId = getAccountId(account);
    const positions = await this.getPositions(account);
    const position = positions.filter((p) => p.future === symbol).pop();
    if (!position) {
      error(NO_CURRENT_POSITION(accountId, this.exchangeId, symbol));
      throw new NoOpenPositionError(
        NO_CURRENT_POSITION(accountId, this.exchangeId, symbol)
      );
    } else {
      debug(
        POSITION_READ_SUCCESS(accountId, this.exchangeId, symbol, position)
      );
    }
    return position;
  };

  getTickerPositionSize = async (
    account: Account,
    ticker: Ticker
  ): Promise<number> => {
    const position = await this.getTickerPosition(account, ticker);
    return Number(position.cost);
  };

  getPositions = async (account: Account): Promise<IFTXFuturesPosition[]> => {
    const accountId = getAccountId(account);
    try {
      const accountInfos = await this.sessions
        .get(accountId)
        .exchange.privateGetAccount();
      const positions = accountInfos.result.positions.filter(
        (p: IFTXFuturesPosition) => Number(p.size)
      );
      debug(POSITIONS_READ_SUCCESS(accountId, this.exchangeId, positions));
      return positions;
    } catch (err) {
      error(POSITIONS_READ_ERROR(accountId, this.exchangeId), err);
      throw new PositionsFetchError(
        POSITIONS_READ_ERROR(accountId, this.exchangeId, err.message)
      );
    }
  };

  handleReverseOrder = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void> => {
    const { direction } = trade;
    const accountId = getAccountId(account);
    try {
      const position = await this.getTickerPosition(account, ticker);
      if (position && isSideDifferent(position.side as Side, direction)) {
        info(REVERSING_TRADE(this.exchangeId, accountId, ticker.symbol));
        await this.closeOrder(account, trade, ticker);
      }
    } catch (err) {
      // ignore throw
    }
  };

  handleMaxBudget = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void> => {
    const { symbol, max, direction, size } = trade;
    const accountId = getAccountId(account);
    const side = getTradeSide(direction);
    // we add a check since FTX is a composite exchange
    const current = isFTXSpot(ticker)
      ? this.getTokensPrice(
          ticker,
          await this.getTickerBalance(account, ticker)
        )
      : await this.getTickerPositionSize(account, ticker);
    if (Math.abs(current) + Number(size) > Number(max)) {
      error(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
      throw new OpenPositionError(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
    }
  };

  handleSpotOverflow = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean> => {
    const { direction, size } = trade;
    const accountId = getAccountId(account);
    const balance = this.getTokensPrice(
      ticker,
      await this.getTickerBalance(account, ticker)
    );
    if (
      balance &&
      getTradeSide(direction) === Side.Sell &&
      balance < Number(size)
    ) {
      info(TRADE_OVERFLOW(this.exchangeId, accountId, ticker.symbol));
      await this.closeOrder(
        account,
        { ...trade, size: balance.toString() }, // TODO replace this crap
        ticker
      );
      return true;
    }
  };

  handleFuturesOverflow = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean> => {
    const { direction, size } = trade;
    const accountId = getAccountId(account);
    const position = await this.getTickerPosition(account, ticker);
    if (
      position &&
      isSideDifferent(position.side as Side, direction) &&
      Number(size) > Math.abs(Number(position.cost))
    ) {
      info(TRADE_OVERFLOW(this.exchangeId, accountId, ticker.symbol));
      await this.closeOrder(account, trade, ticker);
      return true;
    }
  };

  handleOverflow = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean> => {
    try {
      isFTXSpot(ticker)
        ? this.handleSpotOverflow(account, ticker, trade)
        : this.handleFuturesOverflow(account, ticker, trade);
    } catch (err) {
      // ignore throw
    }
    return false;
  };

  getTokensAmount = (ticker: Ticker, dollars: number): number => {
    const { info, symbol } = ticker;
    const tokens = dollars / Number(info.price);
    if (isNaN(tokens)) {
      error(TRADE_CALCULATED_SIZE_ERROR(symbol));
      throw new ConversionError(TRADE_CALCULATED_SIZE_ERROR(symbol));
    }
    debug(TRADE_CALCULATED_SIZE(symbol, tokens, dollars));
    return tokens;
  };

  getTokensPrice = (ticker: Ticker, tokens: number): number => {
    const { info, symbol } = ticker;
    const price = Number(info.price) * tokens;
    if (isNaN(price)) {
      error(TRADE_CALCULATED_SIZE_ERROR(symbol));
      throw new ConversionError(TRADE_CALCULATED_SIZE_ERROR(symbol));
    }
    debug(TRADE_CALCULATED_SIZE(symbol, tokens, price));
    return price;
  };

  getOpenOrderSize = async (
    account: Account,
    ticker: Ticker,
    size: string
  ): Promise<number> => {
    const { symbol } = ticker;
    if (size.includes('%')) {
      const accountId = getAccountId(account);
      try {
        const percent = Number(size.replace(/%/g, ''));
        if (percent <= 0 || percent > 100) {
          error(TRADE_ERROR_SIZE(size));
          throw new OrderSizeError(TRADE_ERROR_SIZE(size));
        }
        let availableFunds = 0;
        if (isFTXSpot(ticker)) {
          const balances = await this.getBalances(account);
          const balance = balances
            .filter((b) => b.coin === ticker.info.quoteCurrency)
            .pop();
          availableFunds = Number(balance.free);
        } else {
          const accountInfos: IFTXAccountInformations = (
            await this.sessions.get(accountId).exchange.privateGetAccount()
          ).result;
          availableFunds = Number(accountInfos.freeCollateral);
        }
        // TODO handle NaN
        debug(
          AVAILABLE_FUNDS(
            accountId,
            this.exchangeId,
            ticker.info.quoteCurrency,
            availableFunds
          )
        );
        const relativeSize = (availableFunds * percent) / 100;
        debug(TRADE_CALCULATED_OPEN_SIZE(relativeSize.toFixed(2), size));
        return relativeSize;
      } catch (err) {
        error(TRADE_CALCULATED_SIZE_ERROR(symbol, err));
        throw new OrderSizeError(TRADE_CALCULATED_SIZE_ERROR(symbol, err));
      }
    } else {
      return Number(size);
    }
  };
}

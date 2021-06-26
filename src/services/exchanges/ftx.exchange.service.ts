import { ExchangeId } from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { getAccountId } from '../../utils/account.utils';
import { Exchange, Ticker } from 'ccxt';
import {
  getCloseOrderSize,
  getInvertedTradeSide,
  getTradeSize,
  getTradeSide
} from '../../utils/trading.utils';
import { Side } from '../../constants/trading.constants';
import { IOrderOptions } from '../../interfaces/trading.interfaces';
import {
  EXCHANGE_AUTHENTICATION_ERROR,
  EXCHANGE_AUTHENTICATION_SUCCESS,
  POSITIONS_READ_ERROR,
  POSITIONS_READ_SUCCESS,
  TICKER_BALANCE_READ_ERROR,
  TICKER_BALANCE_READ_SUCCESS
} from '../../messages/exchanges.messages';
import { debug, error } from '../logger.service';
import {
  ExchangeInstanceInitError,
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
  OPEN_TRADE_NO_CURRENT_OPENED_POSITION,
  REVERSING_TRADE
} from '../../messages/trading.messages';
import { OpenPositionError } from '../../errors/trading.errors';
import { CompositeExchangeService } from './base/composite.exchange.service';
import { IFTXFuturesPosition } from '../../interfaces/exchanges/ftx.exchange.interfaces';

export class FTXExchangeService extends CompositeExchangeService {
  constructor() {
    super(ExchangeId.FTX);
  }

  checkCredentials = async (
    account: Account,
    instance: Exchange
  ): Promise<boolean> => {
    const accountId = getAccountId(account);
    try {
      await this.getBalances(account, instance);
      debug(EXCHANGE_AUTHENTICATION_SUCCESS(accountId, this.exchangeId));
    } catch (err) {
      error(EXCHANGE_AUTHENTICATION_ERROR(accountId, this.exchangeId), err);
      throw new ExchangeInstanceInitError(
        EXCHANGE_AUTHENTICATION_ERROR(accountId, this.exchangeId, err.message)
      );
    }
    return true;
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
      const size = getTradeSize(ticker, Number(balance.free));
      debug(TICKER_BALANCE_READ_SUCCESS(this.exchangeId, accountId, symbol));
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
          size: getCloseOrderSize(trade.size, balance)
        };
      }
    } else {
      const position = await this.getTickerPosition(account, ticker);
      if (position) {
        options = {
          size: getCloseOrderSize(trade.size, Number(position.size)),
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
    const accountId = getAccountId(account);
    const positions = await this.getPositions(account);
    const position = positions.filter((p) => p.future === ticker.symbol).pop();
    if (!position) {
      debug(
        OPEN_TRADE_NO_CURRENT_OPENED_POSITION(
          accountId,
          this.exchangeId,
          ticker.symbol
        )
      );
    }
    return position;
  };

  getTickerPositionSize = async (
    account: Account,
    ticker: Ticker
  ): Promise<number> => {
    const position = await this.getTickerPosition(account, ticker);
    if (position) {
      return getTradeSize(ticker, Number(position.size));
    }
  };

  getPositions = async (account: Account): Promise<IFTXFuturesPosition[]> => {
    const accountId = getAccountId(account);
    try {
      const accountInfos = await this.sessions
        .get(accountId)
        .exchange.privateGetAccount();
      const positions = accountInfos.result.positions;
      debug(POSITIONS_READ_SUCCESS(accountId, this.exchangeId));
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
    const side = getTradeSide(direction);
    // TODO handle err
    const position = await this.getTickerPosition(account, ticker);
    if (position) {
      const positionSize = getTradeSize(ticker, Number(position.size));
      const positionSide = getTradeSide(position.side as Side);
      if (positionSize && positionSide !== side) {
        debug(REVERSING_TRADE(this.exchangeId, accountId, ticker.symbol));
        await this.closeOrder(account, trade, ticker);
      }
    }
  };

  handleMaxBudget = async (
    account: Account,
    ticker: Ticker,
    trade: Trade,
    orderSize: number
  ): Promise<void> => {
    const { symbol, max, direction } = trade;
    const { exchange } = account;
    const id = getAccountId(account);
    const side = getTradeSide(direction);
    // we add a check since FTX is a composite exchange
    const current = isFTXSpot(ticker)
      ? await this.getTickerBalance(account, ticker)
      : await this.getTickerPositionSize(account, ticker);
    if (current + getTradeSize(ticker, orderSize) > Number(max)) {
      error(OPEN_TRADE_ERROR_MAX_SIZE(exchange, id, symbol, side, max));
      throw new OpenPositionError(
        OPEN_TRADE_ERROR_MAX_SIZE(exchange, id, symbol, side, max)
      );
    }
  };
}

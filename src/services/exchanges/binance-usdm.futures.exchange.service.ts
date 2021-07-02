import { Exchange, Ticker } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { Side } from '../../constants/trading.constants';
import { Account } from '../../entities/account.entities';
import { Trade } from '../../entities/trade.entities';
import {
  ConversionError,
  ExchangeInstanceInitError,
  PositionsFetchError
} from '../../errors/exchange.errors';
import {
  NoOpenPositionError,
  OpenPositionError
} from '../../errors/trading.errors';
import { IBinanceFuturesUSDPosition } from '../../interfaces/exchanges/binance.exchange.interfaces';
import { IOrderOptions } from '../../interfaces/trading.interfaces';
import {
  EXCHANGE_AUTHENTICATION_ERROR,
  EXCHANGE_AUTHENTICATION_SUCCESS,
  POSITIONS_READ_ERROR,
  POSITIONS_READ_SUCCESS,
  NO_CURRENT_POSITION,
  POSITION_READ_SUCCESS
} from '../../messages/exchanges.messages';
import {
  OPEN_TRADE_ERROR_MAX_SIZE,
  REVERSING_TRADE,
  TRADE_CALCULATED_SIZE,
  TRADE_CALCULATED_SIZE_ERROR,
  TRADE_OVERFLOW
} from '../../messages/trading.messages';
import { getAccountId } from '../../utils/account.utils';
import { formatBinanceFuturesSymbol } from '../../utils/exchanges/binance.exchange.utils';
import {
  getCloseOrderSize,
  getTradeSide,
  isSideDifferent
} from '../../utils/trading.utils';
import { debug, error, info } from '../logger.service';
import { FuturesExchangeService } from './base/futures.exchange.service';

export class BinanceFuturesUSDMExchangeService extends FuturesExchangeService {
  constructor() {
    super(ExchangeId.BinanceFuturesUSD);
  }

  checkCredentials = async (
    account: Account,
    instance: Exchange
  ): Promise<boolean> => {
    const accountId = getAccountId(account);
    try {
      await instance.fetch_balance();
      debug(EXCHANGE_AUTHENTICATION_SUCCESS(accountId, this.exchangeId));
    } catch (err) {
      error(EXCHANGE_AUTHENTICATION_ERROR(accountId, this.exchangeId), err);
      throw new ExchangeInstanceInitError(
        EXCHANGE_AUTHENTICATION_ERROR(accountId, this.exchangeId, err.message)
      );
    }
    return true;
  };

  getTickerPosition = async (
    account: Account,
    ticker: Ticker
  ): Promise<IBinanceFuturesUSDPosition> => {
    const accountId = getAccountId(account);
    const symbol = formatBinanceFuturesSymbol(ticker.symbol);
    const positions = await this.getPositions(account);
    const position = positions.filter((p) => p.symbol === symbol).pop();
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
    return Number(position.notional);
  };

  getPositions = async (
    account: Account
  ): Promise<IBinanceFuturesUSDPosition[]> => {
    const accountId = getAccountId(account);
    try {
      const positions = await this.sessions
        .get(accountId)
        .exchange.fetchPositions();
      const filtered = positions.filter((p: IBinanceFuturesUSDPosition) =>
        Number(p.positionAmt)
      );
      debug(POSITIONS_READ_SUCCESS(accountId, this.exchangeId, filtered));
      return filtered;
    } catch (err) {
      error(POSITIONS_READ_ERROR(accountId, this.exchangeId), err);
      throw new PositionsFetchError(
        POSITIONS_READ_ERROR(accountId, this.exchangeId, err.message)
      );
    }
  };

  getCloseOrderOptions = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<IOrderOptions> => {
    const position = await this.getTickerPosition(account, ticker);
    const size = Number(position.positionAmt);
    return {
      size: getCloseOrderSize(ticker, trade.size, Math.abs(size)),
      side: size > 0 ? Side.Sell : Side.Buy
    };
  };

  handleReverseOrder = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void> => {
    const { direction } = trade;
    const accountId = getAccountId(account);
    const side = getTradeSide(direction);
    try {
      const size = await this.getTickerPositionSize(account, ticker);
      if (
        size &&
        ((size < 0 && side === Side.Buy) || (size > 0 && side === Side.Sell))
      ) {
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
    const current = await this.getTickerPositionSize(account, ticker);
    if (Math.abs(current) + Number(size) > Number(max)) {
      error(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
      throw new OpenPositionError(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
    }
  };

  handleOverflow = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean> => {
    const { direction, size } = trade;
    const accountId = getAccountId(account);
    try {
      // TODO refacto
      const position = await this.getTickerPosition(account, ticker);
      if (
        position &&
        isSideDifferent(position.positionSide as Side, direction) &&
        Number(size) > Math.abs(Number(position.notional))
      ) {
        info(TRADE_OVERFLOW(this.exchangeId, accountId, ticker.symbol));
        await this.closeOrder(account, trade, ticker);
        return true;
      }
    } catch (err) {
      // ignore throw
    }
    return false;
  };

  getTokensAmount = (ticker: Ticker, dollars: number): number => {
    const { info, symbol } = ticker;
    const tokens = dollars / Number(info.lastPrice);
    if (isNaN(tokens)) {
      error(TRADE_CALCULATED_SIZE_ERROR(symbol));
      throw new ConversionError(TRADE_CALCULATED_SIZE_ERROR(symbol));
    }
    debug(TRADE_CALCULATED_SIZE(symbol, tokens, dollars));
    return tokens;
  };

  getTokensPrice = (ticker: Ticker, tokens: number): number => {
    const { info, symbol } = ticker;
    const price = Number(info.lastPrice) * tokens;
    if (isNaN(price)) {
      error(TRADE_CALCULATED_SIZE_ERROR(symbol));
      throw new ConversionError(TRADE_CALCULATED_SIZE_ERROR(symbol));
    }
    debug(TRADE_CALCULATED_SIZE(symbol, tokens, price));
    return price;
  };
}

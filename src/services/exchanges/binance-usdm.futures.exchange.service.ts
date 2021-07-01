import { Exchange, Ticker } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { Side } from '../../constants/trading.constants';
import { Account } from '../../entities/account.entities';
import { Trade } from '../../entities/trade.entities';
import {
  ExchangeInstanceInitError,
  PositionsFetchError
} from '../../errors/exchange.errors';
import { OpenPositionError } from '../../errors/trading.errors';
import { IBinanceFuturesUSDPosition } from '../../interfaces/exchanges/binance.exchange.interfaces';
import { IOrderOptions } from '../../interfaces/trading.interfaces';
import {
  EXCHANGE_AUTHENTICATION_ERROR,
  EXCHANGE_AUTHENTICATION_SUCCESS,
  POSITIONS_READ_ERROR,
  POSITIONS_READ_SUCCESS,
  POSITION_NOT_CURRENT,
  POSITION_READ_SUCCESS
} from '../../messages/exchanges.messages';
import {
  OPEN_TRADE_ERROR_MAX_SIZE,
  REVERSING_TRADE
} from '../../messages/trading.messages';
import { getAccountId } from '../../utils/account.utils';
import { formatBinanceFuturesSymbol } from '../../utils/exchanges/binance.exchange.utils';
import {
  getCloseOrderSize,
  getTradeSize,
  getTradeSide
} from '../../utils/trading.utils';
import { debug, error } from '../logger.service';
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
    if (position) {
      debug(
        POSITION_READ_SUCCESS(accountId, this.exchangeId, symbol, position)
      );
    } else {
      debug(POSITION_NOT_CURRENT(accountId, this.exchangeId, ticker.symbol));
    }
    return position;
  };

  getTickerPositionSize = async (
    account: Account,
    ticker: Ticker
  ): Promise<number> => {
    const position = await this.getTickerPosition(account, ticker);
    if (position) {
      return getTradeSize(ticker, Number(position.notional));
    }
  };

  getPositions = async (
    account: Account,
    instance?: Exchange
  ): Promise<IBinanceFuturesUSDPosition[]> => {
    const accountId = getAccountId(account);
    try {
      if (!instance) {
        instance = (await this.refreshSession(account)).exchange;
      }
      const positions = await instance
        .fetchPositions()
        .filter((p: IBinanceFuturesUSDPosition) => Number(p.positionAmt));
      debug(POSITIONS_READ_SUCCESS(accountId, this.exchangeId, positions));
      return positions;
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
    const size = await this.getTickerPositionSize(account, ticker);
    if (
      size &&
      ((size < 0 && side === Side.Buy) || (size > 0 && side === Side.Sell))
    ) {
      debug(REVERSING_TRADE(this.exchangeId, accountId, ticker.symbol));
      await this.closeOrder(account, trade, ticker);
    }
  };

  handleMaxBudget = async (
    account: Account,
    ticker: Ticker,
    trade: Trade,
    orderSize: number
  ): Promise<void> => {
    const { symbol, max, direction } = trade;
    const accountId = getAccountId(account);
    const side = getTradeSide(direction);
    const current = await this.getTickerPositionSize(account, ticker);
    if (current + getTradeSize(ticker, orderSize) > Number(max)) {
      error(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
      throw new OpenPositionError(
        OPEN_TRADE_ERROR_MAX_SIZE(this.exchangeId, accountId, symbol, side, max)
      );
    }
  };
}

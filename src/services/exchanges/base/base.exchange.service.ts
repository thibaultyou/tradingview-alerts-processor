import { Exchange, Order, Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { ExchangeId } from '../../../constants/exchanges.constants';
import { getAccountId } from '../../../utils/account.utils';
import ccxt = require('ccxt');
import {
  EXCHANGE_INIT_ERROR,
  EXCHANGE_INIT_SUCCESS,
  TICKER_READ_ERROR,
  TICKER_READ_SUCCESS
} from '../../../messages/exchanges.messages';
import { close, debug, error, long, short } from '../../logger.service';
import {
  ExchangeInstanceInitError,
  TickerFetchError
} from '../../../errors/exchange.errors';
import { Trade } from '../../../entities/trade.entities';
import { IOrderOptions } from '../../../interfaces/trading.interfaces';
import {
  CLOSE_TRADE_ERROR,
  CLOSE_TRADE_SUCCESS,
  OPEN_LONG_TRADE_SUCCESS,
  OPEN_SHORT_TRADE_SUCCESS,
  OPEN_TRADE_ERROR
} from '../../../messages/trading.messages';
import {
  ClosePositionError,
  OpenPositionError
} from '../../../errors/trading.errors';
import { Side, TradingMode } from '../../../constants/trading.constants';
import { getTradeSide } from '../../../utils/trading.utils';
import { getExchangeOptions } from '../../../utils/exchanges/common.exchange.utils';
import { ISession } from '../../../interfaces/exchanges/common.exchange.interfaces';
import { IBaseExchange } from '../../../interfaces/exchanges/base/base.exchange.interface';

export abstract class BaseExchangeService implements IBaseExchange {
  exchangeId: ExchangeId;
  defaultExchange: Exchange;
  sessions = new Map<string, ISession>(); // account id, exchange session

  constructor(exchangeId: ExchangeId) {
    this.exchangeId = exchangeId;
    this.defaultExchange = new ccxt[exchangeId]();
  }

  abstract getCloseOrderOptions(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<IOrderOptions>;

  abstract checkCredentials(
    account: Account,
    instance: Exchange
  ): Promise<boolean>;

  abstract handleMaxBudget(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void>;

  abstract handleReverseOrder(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void>;

  abstract handleOverflow(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean>;

  abstract getTokensAmount(ticker: Ticker, dollars: number): number;

  abstract getTokensPrice(ticker: Ticker, tokens: number): number;

  refreshSession = async (account: Account): Promise<ISession> => {
    const accountId = getAccountId(account);
    let session = this.sessions.get(accountId);
    if (!session) {
      try {
        const options = getExchangeOptions(this.exchangeId, account);
        const instance = new ccxt[this.exchangeId](options);
        await this.checkCredentials(account, instance);
        this.sessions.set(accountId, { exchange: instance, account });
      } catch (err) {
        error(EXCHANGE_INIT_ERROR(accountId, this.exchangeId), err);
        throw new ExchangeInstanceInitError(
          EXCHANGE_INIT_ERROR(accountId, this.exchangeId, err.message)
        );
      }
    }
    // we double check here
    session = this.sessions.get(accountId);
    if (!session) {
      error(EXCHANGE_INIT_ERROR(accountId, this.exchangeId));
      throw new ExchangeInstanceInitError(
        EXCHANGE_INIT_ERROR(accountId, this.exchangeId)
      );
    }
    debug(EXCHANGE_INIT_SUCCESS(accountId, this.exchangeId));
    return session;
  };

  getTicker = async (symbol: string): Promise<Ticker> => {
    try {
      const ticker: Ticker = await this.defaultExchange.fetchTicker(symbol);
      debug(TICKER_READ_SUCCESS(this.exchangeId, symbol, ticker));
      return ticker;
    } catch (err) {
      error(TICKER_READ_ERROR(this.exchangeId, symbol), err);
      throw new TickerFetchError(
        TICKER_READ_ERROR(this.exchangeId, symbol, err.message)
      );
    }
  };

  closeOrder = async (
    account: Account,
    trade: Trade,
    ticker?: Ticker
  ): Promise<Order> => {
    await this.refreshSession(account);
    const { symbol } = trade;
    const accountId = getAccountId(account);
    try {
      if (!ticker) {
        ticker = await this.getTicker(symbol);
      }
      const options = await this.getCloseOrderOptions(account, ticker, trade);
      const order = await this.sessions
        .get(accountId)
        .exchange.createMarketOrder(symbol, options.side, options.size);
      close(
        CLOSE_TRADE_SUCCESS(
          this.exchangeId,
          accountId,
          symbol,
          options.size,
          this.getTokensPrice(ticker, order.amount).toFixed(2)
        )
      );
      return order;
    } catch (err) {
      error(CLOSE_TRADE_ERROR(this.exchangeId, accountId, symbol), err);
      throw new ClosePositionError(
        CLOSE_TRADE_ERROR(this.exchangeId, accountId, symbol)
      );
    }
  };

  handleTradingOptions = async (
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean> => {
    const { max, mode } = trade;
    if (mode === TradingMode.Reverse) {
      await this.handleReverseOrder(account, ticker, trade);
    } else if (mode === TradingMode.Overflow) {
      const isOverflowing = await this.handleOverflow(account, ticker, trade);
      if (isOverflowing) {
        return false; // on overflow we only close position
      }
    }
    if (max) {
      await this.handleMaxBudget(account, ticker, trade);
    }
    return true;
  };

  openOrder = async (account: Account, trade: Trade): Promise<Order> => {
    await this.refreshSession(account);
    const { direction, size, symbol } = trade;
    const accountId = getAccountId(account);
    const side = getTradeSide(direction);
    try {
      const ticker = await this.getTicker(symbol);
      const orderSize = this.getTokensAmount(ticker, Number(size));
      const isOpenOrderAllowed = await this.handleTradingOptions(
        account,
        ticker,
        trade
      );
      if (isOpenOrderAllowed) {
        const order: Order = await this.sessions
          .get(accountId)
          .exchange.createMarketOrder(
            symbol,
            side as 'buy' | 'sell',
            orderSize
          );
        side === Side.Buy
          ? long(
              OPEN_LONG_TRADE_SUCCESS(this.exchangeId, accountId, symbol, size)
            )
          : short(
              OPEN_SHORT_TRADE_SUCCESS(this.exchangeId, accountId, symbol, size)
            );
        return order;
      }
    } catch (err) {
      error(OPEN_TRADE_ERROR(this.exchangeId, accountId, symbol, side), err);
      throw new OpenPositionError(
        OPEN_TRADE_ERROR(this.exchangeId, accountId, symbol, side)
      );
    }
  };
}

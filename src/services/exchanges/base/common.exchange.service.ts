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
} from '../../../messages/exchange.messages';
import { close, debug, error, long, short } from '../../logger.service';
import {
  ExchangeInstanceInitError,
  TickerFetchError
} from '../../../errors/exchange.errors';
import { Trade } from '../../../entities/trade.entities';
import { IOrderOptions } from '../../../interfaces/trade.interface';
import {
  CLOSE_TRADE_ERROR,
  CLOSE_TRADE_SUCCESS,
  OPEN_LONG_TRADE_SUCCESS,
  OPEN_SHORT_TRADE_SUCCESS,
  OPEN_TRADE_ERROR
} from '../../../messages/trade.messages';
import {
  ClosePositionError,
  OpenPositionError
} from '../../../errors/trade.errors';
import { Side, TradingMode } from '../../../constants/trade.constants';
import { getAverageTradeSize, getTradeSide } from '../../../utils/trade.utils';
import { getExchangeOptions } from '../../../utils/exchanges/common.exchange.utils';
import {
  ICommonExchange,
  ISession
} from '../../../interfaces/exchange.interfaces';

export abstract class CommonExchangeService implements ICommonExchange {
  exchangeId: ExchangeId;
  defaultExchange: Exchange;
  sessions = new Map<string, ISession>(); // account id, exchange session`
  tickers = new Map<string, Ticker>(); // symbol, ticker infos

  constructor(exchangeId: ExchangeId) {
    this.exchangeId = exchangeId;
    this.defaultExchange = new ccxt[exchangeId]();
  }

  abstract getTokenAmountInDollars(ticker: Ticker, size: number): number;

  abstract getCloseOrderOptions(
    account: Account,
    ticker: Ticker
  ): Promise<IOrderOptions>;

  abstract checkCredentials(
    account: Account,
    instance: Exchange
  ): Promise<boolean>;

  abstract handleMaxBudget(
    account: Account,
    ticker: Ticker,
    trade: Trade,
    orderSize: number
  ): Promise<void>;

  abstract handleReverseOrder(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void>;

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
    let ticker = this.tickers.get(symbol);
    if (!ticker) {
      try {
        const ticker: Ticker = await this.defaultExchange.fetchTicker(symbol);
        this.tickers.set(symbol, ticker);
      } catch (err) {
        error(TICKER_READ_ERROR(this.exchangeId, symbol), err);
        throw new TickerFetchError(
          TICKER_READ_ERROR(this.exchangeId, symbol, err.message)
        );
      }
    }
    // we double check here
    ticker = this.tickers.get(symbol);
    if (!ticker) {
      error(TICKER_READ_ERROR(this.exchangeId, symbol));
      throw new TickerFetchError(TICKER_READ_ERROR(this.exchangeId, symbol));
    }
    debug(TICKER_READ_SUCCESS(this.exchangeId, symbol));
    return ticker;
  };

  closeOrder = async (
    account: Account,
    trade: Trade,
    ticker?: Ticker
  ): Promise<Order> => {
    await this.refreshSession(account);
    const { symbol, size } = trade;
    const accountId = getAccountId(account);
    try {
      if (!ticker) {
        ticker = await this.getTicker(symbol);
      }
      const options = await this.getCloseOrderOptions(account, ticker);
      const order = await this.sessions
        .get(accountId)
        .exchange.createMarketOrder(symbol, options.side, options.size);
      const percentage = size && size.includes('%') ? size : '100%';
      const absoluteSize = this.getTokenAmountInDollars(ticker, options.size);

      close(
        CLOSE_TRADE_SUCCESS(
          this.exchangeId,
          accountId,
          symbol,
          absoluteSize,
          percentage
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

  openOrder = async (account: Account, trade: Trade): Promise<Order> => {
    await this.refreshSession(account);
    const { direction, size, max, symbol, mode } = trade;
    const accountId = getAccountId(account);
    const side = getTradeSide(direction);
    try {
      const ticker = await this.getTicker(symbol);
      if (mode === TradingMode.Reverse || mode === TradingMode.Overflow) {
        await this.handleReverseOrder(account, ticker, trade);
        if (mode === TradingMode.Overflow) {
          return;
        }
      }
      const orderSize = getAverageTradeSize(this.exchangeId, ticker, size);
      if (max) {
        await this.handleMaxBudget(account, ticker, trade, orderSize);
      }
      const order: Order = await this.sessions
        .get(accountId)
        .exchange.createMarketOrder(symbol, side as 'buy' | 'sell', orderSize);
      side === Side.Buy
        ? long(
            OPEN_LONG_TRADE_SUCCESS(this.exchangeId, accountId, symbol, size)
          )
        : short(
            OPEN_SHORT_TRADE_SUCCESS(this.exchangeId, accountId, symbol, size)
          );
      return order;
    } catch (err) {
      error(OPEN_TRADE_ERROR(this.exchangeId, accountId, symbol, side), err);
      throw new OpenPositionError(
        OPEN_TRADE_ERROR(this.exchangeId, accountId, symbol, side)
      );
    }
  };
}

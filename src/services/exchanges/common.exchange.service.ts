import { Exchange, Order, Ticker } from 'ccxt';
import { Account } from '../../entities/account.entities';
import { IBalance } from '../../interfaces/exchange.interfaces';
import { ExchangeId } from '../../constants/exchanges.constants';
import { getAccountId } from '../../utils/account.utils';
import ccxt = require('ccxt');
import {
  BALANCE_READ_ERROR,
  BALANCE_READ_SUCCESS,
  EXCHANGE_AUTHENTICATION_ERROR,
  EXCHANGE_AUTHENTICATION_SUCCESS,
  EXCHANGE_INIT_ERROR,
  EXCHANGE_INIT_SUCCESS,
  TICKER_READ_ERROR,
  TICKER_READ_SUCCESS
} from '../../messages/exchange.messages';
import { close, debug, error, long, short } from '../logger.service';
import {
  BalancesFetchError,
  ExchangeInstanceInitError,
  TickerFetchError
} from '../../errors/exchange.errors';
import { Trade } from '../../entities/trade.entities';
import { IOrderOptions } from '../../interfaces/trade.interface';
import {
  CLOSE_TRADE_ERROR,
  CLOSE_TRADE_SUCCESS,
  OPEN_LONG_TRADE_SUCCESS,
  OPEN_SHORT_TRADE_SUCCESS,
  OPEN_TRADE_ERROR,
  OPEN_TRADE_ERROR_MAX_SIZE,
  REVERSING_TRADE
} from '../../messages/trade.messages';
import {
  ClosePositionError,
  OpenPositionError
} from '../../errors/trade.errors';
import { Side, TradingMode } from '../../constants/trade.constants';
import { getAverageTradeSize, getTradeSide } from '../../utils/trade.utils';
import { formatBalances, getExchangeOptions } from '../../utils/exchange.utils';

interface Session {
  account: Account;
  exchange: Exchange;
}

export abstract class CommonExchangeService {
  exchangeId: ExchangeId;
  private defaultExchange: Exchange;
  sessions = new Map<string, Session>(); // account id, exchange session
  private tickers = new Map<string, Ticker>(); // symbol, ticker infos

  constructor(exchangeId: ExchangeId) {
    this.exchangeId = exchangeId;
    this.defaultExchange = new ccxt[exchangeId]();
  }

  refreshSession = async (account: Account): Promise<Session> => {
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

  getBalances = async (
    account: Account,
    instance?: Exchange
  ): Promise<IBalance[]> => {
    const accountId = getAccountId(account);
    try {
      if (!instance) {
        instance = (await this.refreshSession(account)).exchange;
      }
      // we don't use fetchBalance() because coin is not returned
      const balances = await instance.fetch_balance();
      debug(BALANCE_READ_SUCCESS(this.exchangeId, accountId));
      return formatBalances(this.exchangeId, balances);
    } catch (err) {
      error(BALANCE_READ_ERROR(this.exchangeId, accountId), err);
      throw new BalancesFetchError(
        BALANCE_READ_ERROR(this.exchangeId, accountId, err.message)
      );
    }
  };

  private checkCredentials = async (
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

  abstract getTokenAmountInDollars(ticker: Ticker, size: number): number;

  abstract getTickerBalance(account: Account, ticker: Ticker): Promise<number>;

  abstract getCloseOrderOptions(
    account: Account,
    ticker: Ticker
  ): Promise<IOrderOptions>;

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
        const isClosingNeeded = await this.getClosingStatus(
          account,
          ticker,
          trade
        );
        if (isClosingNeeded) {
          debug(REVERSING_TRADE(this.exchangeId, accountId, symbol));
          await this.closeOrder(account, trade, ticker);
        }
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
    const current = await this.getTickerBalance(account, ticker);
    if (
      current + this.getTokenAmountInDollars(ticker, orderSize) >
      Number(max)
    ) {
      error(OPEN_TRADE_ERROR_MAX_SIZE(exchange, id, symbol, side, max));
      throw new OpenPositionError(
        OPEN_TRADE_ERROR_MAX_SIZE(exchange, id, symbol, side, max)
      );
    }
  };

  abstract getClosingStatus(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean>;
}

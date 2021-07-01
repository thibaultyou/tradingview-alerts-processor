import { Account } from '../../entities/account.entities';
import { Exchange, Order, Ticker } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { FuturesPosition } from '../../types/exchanges.types';
import { IOrderOptions } from '../trading.interfaces';
import { Trade } from '../../entities/trade.entities';

export interface IBalance {
  coin: string;
  total: string;
  free: string;
}

export interface ISession {
  account: Account;
  exchange: Exchange;
}

export interface ICommonExchange {
  exchangeId: ExchangeId;
  defaultExchange: Exchange;
  sessions: Map<string, ISession>;

  getCloseOrderOptions(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<IOrderOptions>;

  checkCredentials(account: Account, instance: Exchange): Promise<boolean>;

  handleMaxBudget(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void>;

  handleOverflow(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean>;

  refreshSession(account: Account): Promise<ISession>;

  getTicker(symbol: string): Promise<Ticker>;

  closeOrder(account: Account, trade: Trade, ticker?: Ticker): Promise<Order>;

  openOrder(account: Account, trade: Trade): Promise<Order>;

  handleReverseOrder(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void>;
}

export interface IFuturesExchange {
  getPositions(
    account: Account,
    instance?: Exchange
  ): Promise<FuturesPosition[]>;

  getTickerPosition(account: Account, ticker: Ticker): Promise<FuturesPosition>;

  getTickerPositionSize(account: Account, ticker: Ticker): Promise<number>;
}

export interface ISpotExchange {
  getTickerBalance(account: Account, ticker: Ticker): Promise<number>;

  getBalances(account: Account, instance?: Exchange): Promise<IBalance[]>;
}

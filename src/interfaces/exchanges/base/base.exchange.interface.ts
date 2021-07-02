import { ExchangeId, Exchange, Ticker, Order } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { Trade } from '../../../entities/trade.entities';
import { IMarket } from '../../market.interfaces';
import { IOrderOptions } from '../../trading.interfaces';
import { ISession } from '../common.exchange.interfaces';

export interface IBaseExchange {
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

  handleTradingOptions(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean>;

  getTokensAmount(ticker: Ticker, size: number): number;

  getMarkets(): Promise<IMarket[]>;
}

import { Exchange, Order, Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { Trade } from '../../../entities/trade.entities';
import { IMarket } from '../../market.interfaces';
import { IOrderOptions } from '../../trading.interfaces';
import { IBalance, ISession } from '../common.exchange.interfaces';

export interface IBaseExchange {
  checkCredentials(account: Account, instance: Exchange): Promise<boolean>;

  refreshSession(account: Account): Promise<ISession>;

  getBalances(account: Account, instance?: Exchange): Promise<IBalance[]>;

  getTicker(symbol: string): Promise<Ticker>;

  getMarkets(): Promise<IMarket[]>;

  getAvailableFunds(account: Account, ticker: Ticker): Promise<number>;

  getOpenOrderOptions(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<IOrderOptions>;

  openOrder(account: Account, trade: Trade): Promise<Order>;

  getCloseOrderOptions(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<IOrderOptions>;

  closeOrder(
    account: Account,
    trade: Trade,
    ticker?: Ticker // can be preloaded in openOrder
  ): Promise<Order>;

  handleOrderModes(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean>;

  handleMaxBudget(
    account: Account,
    ticker: Ticker,
    trade: Trade,
    balance: number
  ): Promise<void>;
}

import { Ticker, Exchange } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { IBalance } from '../common.exchange.interfaces';

export interface ISpotExchange {
  getTickerBalance(account: Account, ticker: Ticker): Promise<number>;

  getBalances(account: Account, instance?: Exchange): Promise<IBalance[]>;
}

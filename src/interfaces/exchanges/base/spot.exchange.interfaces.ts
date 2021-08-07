import { Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';

export interface ISpotExchange {
  getTickerBalance(account: Account, ticker: Ticker): Promise<number>;
}

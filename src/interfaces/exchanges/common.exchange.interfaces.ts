import { Account } from '../../entities/account.entities';
import { Exchange } from 'ccxt';

export interface IBalance {
  coin: string;
  total: string;
  free: string;
}

export interface ISession {
  account: Account;
  exchange: Exchange;
}

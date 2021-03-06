import { Account } from '../entities/account.entities';
import { Trade } from '../entities/trade.entities';

export interface ITradeInfo {
  account: Account;
  trade: Trade;
  id: string;
}

export interface IOrderOptions {
  side: 'sell' | 'buy'; // this type is needed by ccxt for orders
  size: number;
}

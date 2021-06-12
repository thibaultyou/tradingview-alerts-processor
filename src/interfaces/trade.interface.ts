import { Exchange } from 'ccxt';
import { Account } from '../entities/account.entities';
import { Trade } from '../entities/trade.entities';

export interface ITradeInfo {
  exchange: Exchange;
  account: Account;
  trade: Trade;
}

export interface IOrderOptions {
  side: 'sell' | 'buy'; // this type is needed by ccxt for orders
  size: number;
}

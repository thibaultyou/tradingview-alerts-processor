import { Exchange } from 'ccxt';
import { Account } from '../entities/account.entities';
import { Trade } from '../entities/trade.entities';

export interface ITradeInfo {
  exchange: Exchange;
  account: Account;
  trade: Trade;
}

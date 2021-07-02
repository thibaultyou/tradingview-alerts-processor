import { Exchange, Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { FuturesPosition } from '../../../types/exchanges.types';

export interface IFuturesExchange {
  getPositions(
    account: Account,
    instance?: Exchange
  ): Promise<FuturesPosition[]>;

  getTickerPosition(account: Account, ticker: Ticker): Promise<FuturesPosition>;

  getTickerPositionSize(account: Account, ticker: Ticker): Promise<number>;
}

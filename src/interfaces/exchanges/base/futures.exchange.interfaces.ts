import { Exchange, Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { Trade } from '../../../entities/trade.entities';
import { FuturesPosition } from '../../../types/exchanges.types';

export interface IFuturesExchange {
  handleReverseOrder(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<void>;

  handleOverflow(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean>;

  fetchPositions(instance: Exchange): Promise<FuturesPosition[]>;

  getPositions(account: Account): Promise<FuturesPosition[]>;

  getTickerPosition(account: Account, ticker: Ticker): Promise<FuturesPosition>;

  getTickerPositionSize(account: Account, ticker: Ticker): Promise<number>;
}

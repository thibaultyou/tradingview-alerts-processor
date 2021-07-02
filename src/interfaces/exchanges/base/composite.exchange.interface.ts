import { Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { Trade } from '../../../entities/trade.entities';

export interface ICompositeExchange {
  handleSpotOverflow(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean>;

  handleFuturesOverflow(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean>;
}

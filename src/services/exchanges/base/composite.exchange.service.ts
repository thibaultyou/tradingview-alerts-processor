import { Exchange, Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { IFuturesExchange } from '../../../interfaces/exchanges.interfaces';
import { FuturesPosition } from '../../../types/exchanges.types';
import { SpotExchangeService } from './spot.exchange.service';

// FIXME can be replaced by a mixin
export abstract class CompositeExchangeService
  extends SpotExchangeService
  implements IFuturesExchange
{
  abstract getPositions(
    account: Account,
    instance?: Exchange
  ): Promise<FuturesPosition[]>;

  abstract getTickerPosition(
    account: Account,
    ticker: Ticker
  ): Promise<FuturesPosition>;

  abstract getTickerPositionSize(
    account: Account,
    ticker: Ticker
  ): Promise<number>;
}

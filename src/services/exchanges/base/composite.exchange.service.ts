import { Exchange, Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { Trade } from '../../../entities/trade.entities';
import { IFuturesExchange } from '../../../interfaces/exchanges/base/futures.exchange.interface';

import { FuturesPosition } from '../../../types/exchanges.types';
import { SpotExchangeService } from './spot.exchange.service';
import { ICompositeExchange } from '../../../interfaces/exchanges/base/composite.exchange.interface';

// FIXME can be replaced by a mixin
export abstract class CompositeExchangeService
  extends SpotExchangeService
  implements IFuturesExchange, ICompositeExchange
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

  // above is the same as FuturesExchangeService since I'm not playing with mixins for now

  abstract handleSpotOverflow(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean>;

  abstract handleFuturesOverflow(
    account: Account,
    ticker: Ticker,
    trade: Trade
  ): Promise<boolean>;
}

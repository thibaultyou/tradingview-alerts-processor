import { Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { Trade } from '../../../entities/trade.entities';
import { ICompositeExchange } from '../../../interfaces/exchanges/base/composite.exchange.interface';
import { FuturesExchangeService } from './futures.exchange.service';
import { ISpotExchange } from '../../../interfaces/exchanges/base/spot.exchange.interface';

// FIXME can be replaced by a mixin
export abstract class CompositeExchangeService
  extends FuturesExchangeService
  implements ISpotExchange, ICompositeExchange
{
  abstract getTickerBalance(account: Account, ticker: Ticker): Promise<number>;

  // above is the same as SpotExchangeService since I'm not playing with mixins for now

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

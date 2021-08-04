import { Ticker } from 'ccxt';
import { Account } from '../../../entities/account.entities';
import { FuturesExchangeService } from './futures.exchange.service';
import { ISpotExchange } from '../../../interfaces/exchanges/base/spot.exchange.interface';

// FIXME can be replaced by a mixin
export abstract class CompositeExchangeService
  extends FuturesExchangeService
  implements ISpotExchange
{
  abstract getTickerBalance(account: Account, ticker: Ticker): Promise<number>;
  // above declaration is the same as SpotExchangeService since I'm not playing with mixins for now
}

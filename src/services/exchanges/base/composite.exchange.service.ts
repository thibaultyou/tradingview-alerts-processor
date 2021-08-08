import { ISpotExchange } from '../../../interfaces/exchanges/base/spot.exchange.interfaces';
import { FuturesExchangeService } from './futures.exchange.service';

// FIXME can be replaced by a mixin
export abstract class CompositeExchangeService
  extends FuturesExchangeService
  implements ISpotExchange {}

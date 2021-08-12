import { ExchangeId } from '../../constants/exchanges.constants';
import { SpotExchangeService } from './base/spot.exchange.service';

// TODO replace by a composite exchange
export class KuCoinExchangeService extends SpotExchangeService {
  constructor() {
    super(ExchangeId.KuCoin);
  }
}

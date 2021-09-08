import { ExchangeId } from '../../constants/exchanges.constants';
import { SpotExchangeService } from './base/spot.exchange.service';

export class BinanceUSSpotExchangeService extends SpotExchangeService {
  constructor() {
    super(ExchangeId.BinanceUS);
  }
}

import { ExchangeId } from '../../constants/exchanges.constants';
import { SpotExchangeService } from './base/spot.exchange.service';

export class BinanceSpotExchangeService extends SpotExchangeService {
  constructor() {
    super(ExchangeId.Binance);
  }
}

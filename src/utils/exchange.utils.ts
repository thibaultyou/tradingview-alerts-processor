import { Exchange } from '../constants/exchanges.constants';

export const formatExchange = (exchange: Exchange): string =>
  exchange === Exchange.FTX ? 'FTX' : 'Binance';

import { Ticker } from 'ccxt';

export const isFTXSpot = (ticker: Ticker): boolean =>
  ticker.info.type === 'spot';

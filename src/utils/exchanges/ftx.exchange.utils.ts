import { Ticker } from 'ccxt';

export const formatFTXSpotSymbol = (symbol: string): string =>
  symbol.split('/')[0];

export const isFTXSpot = (ticker: Ticker): boolean =>
  ticker.info.type === 'spot';

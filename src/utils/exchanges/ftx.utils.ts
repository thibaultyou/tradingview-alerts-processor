import { Ticker } from 'ccxt';

export const isFTXSpot = (ticker: Ticker): boolean =>
  !ticker.symbol.includes('PERP');

  export const getFTXBaseSymbol = (symbol: string) => symbol.split('/')[0].replace('-PERP', '')
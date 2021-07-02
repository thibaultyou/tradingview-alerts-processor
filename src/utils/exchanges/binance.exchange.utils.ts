export const formatBinanceSpotSymbol = (symbol: string): string =>
  symbol.split('/')[0];

export const formatBinanceFuturesSymbol = (symbol: string): string =>
  symbol.replace('/', '');

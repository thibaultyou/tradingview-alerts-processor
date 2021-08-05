export const getSpotSymbol = (symbol: string): string => symbol.split('/')[0];

export const getSpotQuote = (symbol: string): string => symbol.split('/')[1];

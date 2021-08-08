export const getSymbol = (symbol: string): string => symbol.split('/')[0];

export const getQuote = (symbol: string): string => symbol.split('/')[1];

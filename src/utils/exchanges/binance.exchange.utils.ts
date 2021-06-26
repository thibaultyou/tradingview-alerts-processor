import { IBalance } from '../../interfaces/exchange.interfaces';

export const formatBinanceSpotSymbol = (symbol: string): string =>
  symbol.split('/')[0];

export const formatBinanceFuturesSymbol = (symbol: string): string =>
  symbol.replace('/', '');

export const formatBinanceSpotBalances = (balances: any): IBalance[] =>
  balances.info.balances.map((balance: any) => ({
    coin: balance.asset,
    free: balance.free,
    total: Number(balance.free) + Number(balance.locked)
  }));

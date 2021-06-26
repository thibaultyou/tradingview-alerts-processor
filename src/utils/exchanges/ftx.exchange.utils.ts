import { Ticker } from 'ccxt';
import { IBalance } from '../../interfaces/exchange.interfaces';

export const formatFTXSpotSymbol = (symbol: string): string =>
  symbol.split('/')[0];

export const isFTXSpot = (ticker: Ticker): boolean =>
  ticker.info.type === 'spot';

export const formatFTXSpotBalances = (balances: any): IBalance[] =>
  balances.info.result.map((balance: IBalance) => ({
    coin: balance.coin,
    free: balance.free,
    total: balance.total
  }));

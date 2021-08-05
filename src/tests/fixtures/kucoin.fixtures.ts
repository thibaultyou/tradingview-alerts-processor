import { Ticker } from 'ccxt';
import { IKuCoinBalance } from '../../interfaces/exchanges/kucoin.exchange.interfaces';

export const sampleKuCoinBalance: IKuCoinBalance = {
  id: '610932623151b300069c272a',
  currency: 'USDT',
  type: 'trade',
  balance: '50',
  available: '50',
  holds: '0'
};

export const sampleKuCoinTicker: Ticker = {
  symbol: 'LINK/USDT',
  timestamp: 1627997976076,
  datetime: '2021-08-03T13:39:36.076Z',
  high: 24.42,
  low: 22.11,
  bid: 23.4083,
  bidVolume: undefined,
  ask: 23.4248,
  askVolume: undefined,
  vwap: 23.23655830364867,
  open: undefined,
  close: 23.4071,
  last: 23.4071,
  previousClose: undefined,
  change: 0.7508,
  percentage: 3.3099999999999996,
  average: 22.60423526,
  baseVolume: 666546.00835229,
  quoteVolume: 15488235.185142282,
  info: {
    time: '1627997976076',
    symbol: 'LINK-USDT',
    buy: '23.4083',
    sell: '23.4248',
    changeRate: '0.0331',
    changePrice: '0.7508',
    high: '24.42',
    low: '22.11',
    vol: '666546.00835229',
    volValue: '15488235.185142282938',
    last: '23.4071',
    averagePrice: '22.60423526',
    takerFeeRate: '0.001',
    makerFeeRate: '0.001',
    takerCoefficient: '1',
    makerCoefficient: '1'
  }
};

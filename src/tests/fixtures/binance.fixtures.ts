import {
  IBinanceFuturesUSDPosition,
  IBinanceTicker
} from '../../interfaces/exchanges/binance.exchange.interfaces';
import {
  IBinanceSpotBalance,
  IBinanceFuturesUSDBalance
} from '../../../dist/interfaces/exchanges/binance.exchange.interfaces';

// doge is crap, this is just for testing purposes
export const sampleBinanceTicker: IBinanceTicker = {
  symbol: 'DOGE/USDT',
  timestamp: 1624739575193,
  datetime: '2021-06-26T20:32:55.193Z',
  high: 0.2555,
  low: 0.23057,
  bid: undefined,
  bidVolume: undefined,
  ask: undefined,
  askVolume: undefined,
  vwap: 0.241094,
  open: 0.25362,
  close: 0.23788,
  last: 0.23788,
  previousClose: undefined,
  change: -0.01574,
  percentage: -6.206,
  average: undefined,
  baseVolume: 10646786525,
  quoteVolume: 2566881063.76,
  info: {
    symbol: 'DOGEUSDT',
    priceChange: '-0.00154000',
    priceChangePercent: '-0.627',
    weightedAvgPrice: '0.24334159',
    prevClosePrice: '0.24564000',
    lastPrice: '0.24410000',
    lastQty: '717.50000000',
    bidPrice: '0.24409000',
    bidQty: '4873.10000000',
    askPrice: '0.24410000',
    askQty: '1333.30000000',
    openPrice: '0.24564000',
    highPrice: '0.24923000',
    lowPrice: '0.23839000',
    volume: '1216590181.00000000',
    quoteVolume: '296046987.58141100',
    openTime: '1625158731178',
    closeTime: '1625245131178',
    firstId: '283528047',
    lastId: '283960524',
    count: '432478'
  }
};

// doge is crap, this is just for testing purposes
export const sampleBinanceFuturesUSDPosition: IBinanceFuturesUSDPosition = {
  symbol: 'DOGEUSDT',
  initialMargin: '2.99212200',
  maintMargin: '0.14960610',
  unrealizedProfit: '0.01260000',
  positionInitialMargin: '2.99212200',
  openOrderInitialMargin: '0',
  leverage: '5',
  isolated: false,
  entryPrice: '0.237270',
  maxNotional: '500000',
  positionSide: 'BOTH',
  positionAmt: '63',
  notional: '14.96061000',
  isolatedWallet: '0',
  updateTime: '1624739968269'
};

export const sampleBinanceSpotBalance: IBinanceSpotBalance = {
  asset: 'USDT',
  free: '21.50783772',
  locked: '0.00000000'
};

export const sampleBinanceFuturesUSDBalance: IBinanceFuturesUSDBalance = {
  asset: 'USDT',
  walletBalance: '24.72399527',
  unrealizedProfit: '0.00000000',
  marginBalance: '24.72399527',
  maintMargin: '0.00000000',
  initialMargin: '0.00000000',
  positionInitialMargin: '0.00000000',
  openOrderInitialMargin: '0.00000000',
  maxWithdrawAmount: '24.72399527',
  crossWalletBalance: '24.72399527',
  crossUnPnl: '0.00000000',
  availableBalance: '24.72399527',
  marginAvailable: true,
  updateTime: '1625180601439'
};

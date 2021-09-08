export interface IBinanceFuturesUSDPosition {
  info: unknown;
  symbol: string;
  timestamp: number;
  datetime: string;
  initialMargin: number;
  initialMarginPercentage: number;
  maintenanceMargin: number;
  maintenanceMarginPercentage: number;
  entryPrice: number;
  notional: number;
  leverage: number;
  unrealizedPnl: number;
  contracts: number;
  contractSize: number;
  marginRatio: number;
  collateral: number;
  marginType: string;
  side: string;
  percentage: number;
}

export interface IBinanceFuturesUSDBalance {
  asset: string;
  walletBalance: string;
  unrealizedProfit: string;
  marginBalance: string;
  maintMargin: string;
  initialMargin: string;
  positionInitialMargin: string;
  openOrderInitialMargin: string;
  maxWithdrawAmount: string;
  crossWalletBalance: string;
  crossUnPnl: string;
  availableBalance: string;
  marginAvailable: boolean;
  updateTime: string;
}

export interface IBinanceSpotBalance {
  asset: string;
  free: string;
  locked: string;
}

export interface IBinanceTickerInformations {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: string;
  closeTime: string;
  firstId: string;
  lastId: string;
  count: string;
}

export interface IBinanceTicker {
  symbol: string;
  timestamp: number;
  datetime: string;
  high: number;
  low: number;
  bid: number;
  bidVolume: number;
  ask: number;
  askVolume: number;
  vwap: number;
  open: number;
  close: number;
  last: number;
  previousClose: number;
  change: number;
  percentage: number;
  average: undefined;
  baseVolume: number;
  quoteVolume: number;
  info: IBinanceTickerInformations;
}

export interface IBinanceUSSpotBalance {
  asset: string;
  free: string;
  locked: string;
}

export interface IBinanceUSTickerInformations {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: string;
  closeTime: string;
  firstId: string;
  lastId: string;
  count: string;
}

export interface IBinanceUSTicker {
  symbol: string;
  timestamp: number;
  datetime: string;
  high: number;
  low: number;
  bid: number;
  bidVolume: number;
  ask: number;
  askVolume: number;
  vwap: number;
  open: number;
  close: number;
  last: number;
  previousClose: number;
  change: number;
  percentage: number;
  average: undefined;
  baseVolume: number;
  quoteVolume: number;
  info: IBinanceUSTickerInformations;
}

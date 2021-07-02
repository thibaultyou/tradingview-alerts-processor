export interface IBinanceFuturesUSDPosition {
  symbol: string;
  initialMargin: string;
  maintMargin: string;
  unrealizedProfit: string;
  positionInitialMargin: string;
  openOrderInitialMargin: string;
  leverage: string;
  isolated: boolean;
  entryPrice: string;
  maxNotional: string;
  positionSide: string;
  positionAmt: string;
  notional: string;
  isolatedWallet: string;
  updateTime: string;
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

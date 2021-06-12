export interface IBalance {
  coin: string;
  total: string;
  free: string;
}
export interface IFTXFuturesPosition {
  future: string;
  size: string;
  side: string;
  netSize: string;
  longOrderSize: string;
  shortOrderSize: string;
  cost: string;
  entryPrice: number;
  unrealizedPnl: string;
  realizedPnl: string;
  initialMarginRequirement: string;
  maintenanceMarginRequirement: string;
  openSize: string;
  collateralUsed: string;
  estimatedLiquidationPrice: number;
}

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

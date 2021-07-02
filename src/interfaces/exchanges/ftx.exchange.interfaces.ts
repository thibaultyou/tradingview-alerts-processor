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

export interface IFTXBalance {
  coin: string;
  free: string;
  total: string;
  availableWithoutBorrow: string;
  usdValue: string;
  spotBorrow: string;
}

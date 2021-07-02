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

export interface IFTXAccountInformations {
  username: string;
  collateral: string;
  freeCollateral: string;
  totalAccountValue: string;
  totalPositionSize: string;
  initialMarginRequirement: string;
  maintenanceMarginRequirement: string;
  marginFraction: string;
  openMarginFraction: string;
  liquidating: boolean;
  backstopProvider: boolean;
  positions: any;
  takerFee: string;
  makerFee: string;
  leverage: string;
  positionLimit: string;
  positionLimitUsed: string;
  useFttCollateral: boolean;
  chargeInterestOnNegativeUsd: boolean;
  spotMarginEnabled: boolean;
  spotLendingEnabled: boolean;
}

export interface IFTXTickerInformations {
  name: string;
  enabled: boolean;
  postOnly: boolean;
  priceIncrement: string;
  sizeIncrement: string;
  minProvideSize: string;
  last: string;
  bid: string;
  ask: string;
  price: string;
  type: string;
  baseCurrency: string;
  quoteCurrency: string;
  underlying: unknown;
  restricted: boolean;
  highLeverageFeeExempt: boolean;
  change1h: string;
  change24h: string;
  changeBod: string;
  quoteVolume24h: string;
  volumeUsd24h: string;
}

export interface IFTXTicker {
  symbol: string;
  timestamp: number;
  datetime: string;
  high: unknown;
  low: unknown;
  bid: number;
  bidVolume: unknown;
  ask: number;
  askVolume: unknown;
  vwap: unknown;
  open: unknown;
  close: number;
  last: number;
  previousClose: unknown;
  change: unknown;
  percentage: number;
  average: unknown;
  baseVolume: unknown;
  quoteVolume: number;
  info: IFTXTickerInformations;
}

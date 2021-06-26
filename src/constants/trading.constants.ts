export enum Side {
  Long = 'long',
  Buy = 'buy',
  Short = 'short',
  Sell = 'sell',
  Close = 'close'
}

export const SIDES = [Side.Buy, Side.Close, Side.Long, Side.Sell, Side.Short];

export enum TradingMode {
  Reverse = 'reverse',
  Overflow = 'overflow'
}

export const TRADING_MODES = [TradingMode.Overflow, TradingMode.Reverse];

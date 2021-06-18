export enum ExchangeId {
  Binance = 'binance',
  FTX = 'ftx',
  BinanceFuturesUSD = 'binanceusdm'
}

export const EXCHANGES_NAMES = {
  [ExchangeId.FTX]: 'FTX',
  [ExchangeId.Binance]: 'Binance',
  [ExchangeId.BinanceFuturesUSD]: 'BinanceFutures'
};

export const EXCHANGES = [
  ExchangeId.Binance,
  ExchangeId.FTX,
  ExchangeId.BinanceFuturesUSD
];

export const FTX_SUBACCOUNT_HEADER = 'FTX-SUBACCOUNT';

export const DELAY_BETWEEN_TRADES = {
  [ExchangeId.Binance]: 200, // 10 orders max per second / we add a 100ms margin between orders
  [ExchangeId.BinanceFuturesUSD]: 200, // 10 orders max per second / we add a 100ms margin between orders
  [ExchangeId.FTX]: 350 // 2 orders max per 200ms / we add 150ms margin between orders
};

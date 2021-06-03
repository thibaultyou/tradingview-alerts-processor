export enum Exchange {
  Binance = 'binance',
  FTX = 'ftx'
}

export const EXCHANGES = [Exchange.Binance, Exchange.FTX];

export const FTX_SUBACCOUNT_HEADER = 'FTX-SUBACCOUNT';

export const DELAY_BETWEEN_TRADES = {
  [Exchange.Binance]: 250,
  [Exchange.FTX]: 350
};

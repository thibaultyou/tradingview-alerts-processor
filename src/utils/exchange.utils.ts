import { Exchange } from 'ccxt';
import {
  ExchangeId,
  FTX_SUBACCOUNT_HEADER
} from '../constants/exchanges.constants';
import { Account } from '../entities/account.entities';
import { IBalance } from '../interfaces/exchange.interfaces';
import { BinanceFuturesUSDMExchangeService } from '../services/exchanges/binance-usdm.futures.exchange.service';
import { BinanceSpotExchangeService } from '../services/exchanges/binance.spot.exchange.service';
import { FTXExchangeService } from '../services/exchanges/ftx.exchange.service';
import { ExchangeService } from '../types/exchanges.types';

const EXCHANGE_NAMES = {
  [ExchangeId.FTX]: 'FTX',
  [ExchangeId.Binance]: 'Binance',
  [ExchangeId.BinanceFuturesUSD]: 'BinanceFutures'
};

export const formatExchange = (id: ExchangeId): string => EXCHANGE_NAMES[id];

// TODO replace type any
export const formatBalances = (id: ExchangeId, balances: any): IBalance[] => {
  return id === ExchangeId.FTX
    ? balances.info.result.map((b: IBalance) => ({
        coin: b.coin,
        free: b.free,
        total: b.total
      }))
    : balances.info.balances.map((b: any) => ({
        coin: b.asset,
        free: b.free,
        total: Number(b.free) + Number(b.locked)
      }));
};

export const formatBinanceSpotSymbol = (symbol: string): string =>
  symbol.split('/')[0];

export const formatBinanceFuturesSymbol = (symbol: string): string =>
  symbol.replace('/', '');

export const formatFTXSpotSymbol = (symbol: string): string =>
  symbol.split('/')[0];

// TODO relocate
export const getExchangeService = (exchangeId: ExchangeId): ExchangeService => {
  switch (exchangeId) {
    case ExchangeId.Binance:
      return new BinanceSpotExchangeService();
    case ExchangeId.BinanceFuturesUSD:
      return new BinanceFuturesUSDMExchangeService();
    case ExchangeId.FTX:
    default:
      return new FTXExchangeService();
  }
};

export const getExchangeOptions = (
  exchangeId: ExchangeId,
  account: Account
): Exchange['options'] => {
  const { subaccount, apiKey, secret } = account;
  const options: Exchange['options'] = {
    apiKey: apiKey,
    secret: secret
  };
  if (exchangeId === ExchangeId.FTX && subaccount) {
    options['headers'] = { [FTX_SUBACCOUNT_HEADER]: subaccount };
  }
  return options;
};

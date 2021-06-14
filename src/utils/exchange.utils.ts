import { Exchange } from 'ccxt';
import { ExchangeId } from '../constants/exchanges.constants';
import { Account } from '../entities/account.entities';
import { updateFTXExchangeOptions } from './exchanges/ftx.utils';

const EXCHANGE_NAMES = {
  [ExchangeId.FTX]: 'FTX',
  [ExchangeId.Binance]: 'Binance',
  [ExchangeId.BinanceFuturesUSD]: 'BinanceFutures'
};

export const formatExchange = (id: ExchangeId): string => EXCHANGE_NAMES[id];

export const getExchangeOptions = (account: Account): Exchange['options'] => {
  const { exchange, subaccount, apiKey, secret } = account;
  const options: Exchange['options'] = {
    apiKey: apiKey,
    secret: secret
  };
  if (exchange === ExchangeId.FTX && subaccount) {
    updateFTXExchangeOptions(options, account);
  }
  return options;
};

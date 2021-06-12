import { Exchange } from 'ccxt';
import { ExchangeId } from '../constants/exchanges.constants';
import { Account } from '../entities/account.entities';
import { updateFTXExchangeOptions } from './exchanges/ftx.utils';

export const formatExchange = (exchange: ExchangeId): string =>
  exchange === ExchangeId.FTX ? 'FTX' : 'Binance';

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

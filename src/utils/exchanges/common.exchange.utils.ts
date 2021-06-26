import { Exchange } from 'ccxt';
import {
  ExchangeId,
  EXCHANGES_NAMES,
  FTX_SUBACCOUNT_HEADER
} from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { IBalance } from '../../interfaces/exchange.interfaces';
import { formatBinanceSpotBalances } from './binance.exchange.utils';
import { formatFTXSpotBalances } from './ftx.exchange.utils';

export const formatExchange = (id: ExchangeId): string => EXCHANGES_NAMES[id];

// FIXME remove any
export const formatBalances = (id: ExchangeId, balances: any): IBalance[] => {
  return id === ExchangeId.FTX
    ? formatFTXSpotBalances(balances)
    : formatBinanceSpotBalances(balances);
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
  // FIXME refacto / rmeove specific configs
  if (exchangeId === ExchangeId.FTX && subaccount) {
    options['headers'] = { [FTX_SUBACCOUNT_HEADER]: subaccount };
  }
  return options;
};

import { Exchange } from 'ccxt';
import {
  ExchangeId,
  EXCHANGES_NAMES,
  FTX_SUBACCOUNT_HEADER
} from '../../constants/exchanges.constants';
import { Account } from '../../entities/account.entities';
import { IBalance } from '../../interfaces/exchange.interfaces';

export const formatExchange = (id: ExchangeId): string => EXCHANGES_NAMES[id];

// FIXME refacto / remove any
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

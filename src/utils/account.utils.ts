import { Exchange } from '../constants/exchanges.constants';
import { Account, AccountStub } from '../entities/account.entities';
import { IBalance } from '../interfaces/exchange.interfaces';

export const getAccountId = (account: Account): string => {
  const { subaccount, stub } = account;
  return subaccount ? subaccount : stub;
};

export const formatAccount = (account: Account): Account => {
  const { apiKey, exchange, secret, stub, subaccount } = account;
  const formattedAccount: Account = {
    apiKey: apiKey,
    exchange: exchange,
    secret: secret,
    stub: stub.toUpperCase()
  };
  if (subaccount) {
    formattedAccount['subaccount'] = subaccount;
  }
  return formattedAccount;
};

export const formatAccountStub = ({ stub }: AccountStub): string =>
  stub.toUpperCase();

export const formatBalances = (
  exchange: Exchange,
  // TODO add specific typings for balances
  exchangeBalances: any
): IBalance[] => {
  let balances: IBalance[] = [];
  if (exchange === Exchange.FTX) {
    balances = exchangeBalances.info.result.map((b: IBalance) => ({
      coin: b.coin,
      free: b.free,
      total: b.total
    }));
  } else if (exchange === Exchange.Binance) {
    balances = exchangeBalances.info.balances.map((b: any) => ({
      coin: b.asset,
      free: b.free,
      total: Number(b.free) + Number(b.locked)
    }));
  }
  return balances;
};

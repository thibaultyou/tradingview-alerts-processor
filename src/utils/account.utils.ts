import { Account, AccountStub } from '../entities/account.entities';

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
    account['subaccount'] = subaccount.toUpperCase();
  }
  return formattedAccount;
};

export const formatAccountStub = ({ stub }: AccountStub): string =>
  stub.toUpperCase();

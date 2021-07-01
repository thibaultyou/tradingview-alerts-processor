import { Account, AccountStub } from '../entities/account.entities';

export const getAccountId = (account: Account | AccountStub): string =>
  account.stub.toUpperCase();

export const formatAccount = (account: Account): Account => ({
  ...account,
  stub: getAccountId(account)
});

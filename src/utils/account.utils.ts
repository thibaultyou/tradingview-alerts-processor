import { Account } from '../entities/account.entities';

export const getAccountId = (account: Account): string =>
  account.stub.toUpperCase();

export const formatAccount = (account: Account): Account => ({
  ...account,
  stub: getAccountId(account)
});

export const hideAccountSensitiveData = (account: Account) => {
  const hidden = account;
  delete hidden.secret;
  delete hidden.passphrase;
  return hidden;
};

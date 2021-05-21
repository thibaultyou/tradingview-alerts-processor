import { Account } from '../entities/account.entities';

export const getAccountId = (account: Account): string => {
  const { subaccount, stub } = account;
  return subaccount ? subaccount : stub;
};

import { Account } from '../entities/account.entities';
import { getDatabase } from '../db/store.db';
import { getAccountId } from '../utils/account.utils';

const accounts = new Map<string, Account>();

export const addAccount = (account: Account): boolean => {
  const accountId = getAccountId(account);
  const db = getDatabase();
  try {
    db.getData(`/${accountId}`);
  } catch (err) {
    db.push(`/${accountId}`, account);
    accounts.set(accountId, account);
    return true;
  }
  console.error(`"${accountId}" account already exists.`);
  return false;
};

export const readAccount = (accountId: string): Account => {
  const account = accounts.has(accountId);
  if (!account) {
    const db = getDatabase();
    try {
      const accountEntry = db.getData(`/${accountId}`);
      accounts.set(accountId, accountEntry);
      return accountEntry;
    } catch (err) {
      console.error(`${accountId} account does not exists.`);
    }
  }
  return accounts.get(accountId);
};

export const removeAccount = (accountId: string): boolean => {
  const db = getDatabase();
  try {
    db.getData(`/${accountId}`);
    db.delete(`/${accountId}`);
    accounts.delete(accountId);
    return true;
  } catch (err) {
    console.error(`${accountId} account does not exists.`);
  }
  return false;
};

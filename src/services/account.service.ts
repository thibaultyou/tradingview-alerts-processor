import { Account } from '../entities/account.entities';
import { getDatabase } from '../db/store.db';
import { error, info, warning } from './logger.service';

const accounts = new Map<string, Account>();

export const addAccount = (account: Account): boolean => {
  const { stub } = account;
  const id = stub.toUpperCase();
  const db = getDatabase();
  try {
    db.getData(`/${id}`);
  } catch (err) {
    db.push(`/${id}`, account);
    accounts.set(id, account);
    info(`"${id}" account successfully added.`);
    return true;
  }
  warning(`"${id}" account already exists.`);
  return false;
};

export const readAccount = (accountId: string): Account => {
  const id = accountId.toUpperCase();
  const account = accounts.has(id);
  if (!account) {
    const db = getDatabase();
    try {
      const accountEntry = db.getData(`/${id}`);
      accounts.set(accountId, accountEntry);
      info(`"${id}" account successfully readed.`);
      return accountEntry;
    } catch (err) {
      const message = `${id} account does not exists.`;
      error(message);
      throw new Error(message);
    }
  }
  return accounts.get(accountId);
};

export const removeAccount = (accountId: string): boolean => {
  const id = accountId.toUpperCase();
  const db = getDatabase();
  try {
    db.getData(`/${id}`);
    db.delete(`/${id}`);
    accounts.delete(id);
  } catch (err) {
    const message = `${id} account does not exists.`;
    error(message);
    throw new Error(message);
  }
  return true;
};

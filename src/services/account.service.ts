import { Account } from '../entities/account.entities';
import { getDatabase } from '../db/store.db';
import { debug, error } from './logger.service';
import {
  ACCOUNT_WRITE_SUCCESS,
  ACCOUNT_WRITE_ERROR,
  ACCOUNT_READ_SUCCESS,
  ACCOUNT_READ_ERROR,
  ACCOUNT_DELETE_ERROR,
  ACCOUNT_DELETE_SUCCESS,
  ACCOUNT_WRITE_ERROR_ALREADY_EXISTS
} from '../messages/account.messages';
import { AccountReadError, AccountWriteError } from '../errors/account.errors';
import { JsonDB } from 'node-json-db';
import { refreshExchange } from './exchange.service';

const accounts = new Map<string, Account>();

export const writeAccount = async (account: Account): Promise<Account> => {
  const { stub } = account;
  const id = stub.toUpperCase();
  const path = `/${id}`;
  let db: JsonDB;
  try {
    db = getDatabase();
    db.getData(path);
  } catch (err) {
    debug(err);

    try {
      await refreshExchange(account);
    } catch (err) {
      debug(err);
      error(ACCOUNT_WRITE_ERROR(id));
      throw new AccountWriteError(ACCOUNT_WRITE_ERROR(id, err.message));
    }

    try {
      db.push(path, account);
      accounts.set(id, account);
      debug(ACCOUNT_WRITE_SUCCESS(id));
      return readAccount(id);
    } catch (err) {
      debug(err);
      error(ACCOUNT_WRITE_ERROR(id));
      throw new AccountWriteError(ACCOUNT_WRITE_ERROR(id, err.message));
    }
  }
  error(ACCOUNT_WRITE_ERROR_ALREADY_EXISTS(id));
  throw new AccountWriteError(ACCOUNT_WRITE_ERROR_ALREADY_EXISTS(id));
};

export const readAccount = (accountId: string): Account => {
  const id = accountId.toUpperCase();
  let account = accounts.get(id);
  if (!account) {
    try {
      const db = getDatabase();
      account = db.getData(`/${id}`);
      accounts.set(id, account);
    } catch (err) {
      debug(err);
      error(ACCOUNT_READ_ERROR(id));
      throw new AccountReadError(ACCOUNT_READ_ERROR(id, err.message));
    }
  }
  // we double check here
  account = accounts.get(id);
  if (!account) {
    error(ACCOUNT_READ_ERROR(id));
    throw new AccountReadError(ACCOUNT_READ_ERROR(id));
  }
  debug(ACCOUNT_READ_SUCCESS(id));
  return account;
};

export const removeAccount = (accountId: string): boolean => {
  const id = accountId.toUpperCase();
  const path = `/${id}`;
  try {
    const db = getDatabase();
    accounts.delete(id);
    db.getData(path);
    db.delete(path);
  } catch (err) {
    debug(err);
    error(ACCOUNT_DELETE_ERROR(id));
    throw new AccountWriteError(ACCOUNT_DELETE_ERROR(id, err.message));
  }
  debug(ACCOUNT_DELETE_SUCCESS(id));
  return true;
};

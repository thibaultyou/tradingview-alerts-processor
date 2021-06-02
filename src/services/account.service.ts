import ccxt = require('ccxt');
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
import { getAccountId } from '../utils/account.utils';
import {
  BALANCE_READ_ERROR,
  BALANCE_READ_SUCCESS,
  EXCHANGE_AUTHENTICATION_ERROR,
  EXCHANGE_AUTHENTICATION_SUCCESS
} from '../messages/exchange.messages';
import {
  BalancesFetchError,
  ExchangeInstanceInitError
} from '../errors/exchange.errors';
import { IBalance, IBalances } from '../interfaces/exchange.interfaces';

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

export const checkAccountCredentials = async (
  exchangeInstance: ccxt.Exchange,
  account: Account
): Promise<boolean> => {
  const { exchange } = account;
  const id = getAccountId(account);
  try {
    await getAccountBalances(exchangeInstance, account);
    debug(EXCHANGE_AUTHENTICATION_SUCCESS(id, exchange));
  } catch (err) {
    debug(err);
    error(EXCHANGE_AUTHENTICATION_ERROR(id, exchange));
    throw new ExchangeInstanceInitError(
      EXCHANGE_AUTHENTICATION_ERROR(id, exchange, err.message)
    );
  }
  return true;
};

export const getAccountBalances = async (
  exchangeInstance: ccxt.Exchange,
  account: Account
): Promise<IBalance[]> => {
  const id = getAccountId(account);
  try {
    // we don't use fetchBalance() because coin is not returned
    const result: IBalances = await exchangeInstance.fetch_balance();
    // we're filtering there because balances are dynamic keys
    const balances = result.info.result.map((b: IBalance) => ({
      coin: b.coin,
      free: b.free,
      total: b.total
    }));
    debug(BALANCE_READ_SUCCESS(id));
    return balances;
  } catch (err) {
    debug(err);
    error(BALANCE_READ_ERROR(id));
    throw new BalancesFetchError(BALANCE_READ_ERROR(id, err.message));
  }
};

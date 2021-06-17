import { Account } from '../entities/account.entities';
import { debug, error, info } from './logger.service';
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
import { DatabaseService } from './db.service';
import { TradingService } from './trade.service';

const accounts = new Map<string, Account>();

export const writeAccount = async (account: Account): Promise<Account> => {
  const { stub, exchange } = account;
  const id = stub.toUpperCase();

  let db;
  try {
    db = DatabaseService.getDatabaseInstance();
    const res = await db.read(id);
    if (!res) {
      error(ACCOUNT_READ_ERROR(id));
      throw new AccountReadError(ACCOUNT_READ_ERROR(id));
    }
  } catch (err) {
    try {
      await TradingService.getTradeExecutor(
        exchange
      ).exchangeService.refreshSession(account);
    } catch (err) {
      error(ACCOUNT_WRITE_ERROR(id), err);
      throw new AccountWriteError(ACCOUNT_WRITE_ERROR(id, err.message));
    }

    try {
      await db.create(id, account);
      accounts.set(id, account);
      info(ACCOUNT_WRITE_SUCCESS(id));
      return readAccount(id);
    } catch (err) {
      error(ACCOUNT_WRITE_ERROR(id), err);
      throw new AccountWriteError(ACCOUNT_WRITE_ERROR(id, err.message));
    }
  }
  error(ACCOUNT_WRITE_ERROR_ALREADY_EXISTS(id));
  throw new AccountWriteError(ACCOUNT_WRITE_ERROR_ALREADY_EXISTS(id));
};

export const readAccount = async (accountId: string): Promise<Account> => {
  const id = accountId.toUpperCase();
  let account = accounts.get(id);
  if (!account) {
    try {
      const db = DatabaseService.getDatabaseInstance();
      account = (await db.read(id)) as Account;
      accounts.set(id, account);
    } catch (err) {
      error(ACCOUNT_READ_ERROR(id), err);
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

export const removeAccount = async (accountId: string): Promise<boolean> => {
  const id = accountId.toUpperCase();
  try {
    const db = DatabaseService.getDatabaseInstance();
    accounts.delete(id);
    await db.delete(id);
  } catch (err) {
    error(ACCOUNT_DELETE_ERROR(id), err);
    throw new AccountWriteError(ACCOUNT_DELETE_ERROR(id, err.message));
  }
  info(ACCOUNT_DELETE_SUCCESS(id));
  return true;
};

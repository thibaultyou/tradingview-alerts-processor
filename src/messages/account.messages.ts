import { messageWrapper } from '../utils/logger.utils';

const accountsMessageWrapper = (messsage: string): string =>
  messageWrapper('account', messsage);

export const ACCOUNT_WRITE_SUCCESS = (accountId: string): string =>
  accountsMessageWrapper(
    `${accountId.toUpperCase()} account successfully registered.`
  );

export const ACCOUNT_WRITE_ERROR_ALREADY_EXISTS = (
  accountId: string,
  err?: string
): string =>
  accountsMessageWrapper(
    `Specified stub for ${accountId.toUpperCase()} account already exists${
      err ? ' -> ' + err : ''
    }.`
  );

export const ACCOUNT_WRITE_ERROR = (accountId: string, err?: string): string =>
  accountsMessageWrapper(
    `Unable to register ${accountId.toUpperCase()} account${
      err ? ' -> ' + err : ''
    }.`
  );

export const ACCOUNT_READ_SUCCESS = (accountId: string): string =>
  accountsMessageWrapper(
    `${accountId.toUpperCase()} account successfully loaded.`
  );

export const ACCOUNTS_READ_SUCCESS = (): string =>
  accountsMessageWrapper(`Accounts successfully read.`);

export const ACCOUNT_READ_ERROR = (accountId: string, err?: string): string =>
  accountsMessageWrapper(
    `Failed to load ${accountId.toUpperCase()} account${
      err ? ' -> ' + err : ''
    }.`
  );

export const ACCOUNTS_READ_ERROR = (err?: string): string =>
  accountsMessageWrapper(`Failed to read accounts${err ? ' -> ' + err : ''}.`);

export const ACCOUNT_DELETE_SUCCESS = (accountId: string): string =>
  accountsMessageWrapper(
    `${accountId.toUpperCase()} account successfully deleted.`
  );

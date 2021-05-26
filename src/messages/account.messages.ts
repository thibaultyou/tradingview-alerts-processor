export const ACCOUNT_WRITE_SUCCESS = (accountId: string): string =>
  `${accountId.toUpperCase()} account successfully registered.`;

export const ACCOUNT_WRITE_ERROR_ALREADY_EXISTS = (
  accountId: string,
  err?: string
): string =>
  `Specified stub for ${accountId.toUpperCase()} account already exists${
    err ? ' -> ' + err : ''
  }.`;

export const ACCOUNT_WRITE_ERROR = (accountId: string, err?: string): string =>
  `Unable to register ${accountId.toUpperCase()} account${
    err ? ' -> ' + err : ''
  }.`;

export const ACCOUNT_READ_SUCCESS = (accountId: string): string =>
  `${accountId.toUpperCase()} account successfully readed.`;

export const ACCOUNT_READ_ERROR = (accountId: string, err?: string): string =>
  `${accountId.toUpperCase()} account does not exists${
    err ? ' -> ' + err : ''
  }.`;

export const ACCOUNT_DELETE_SUCCESS = (accountId: string): string =>
  `${accountId.toUpperCase()} account successfully deleted.`;

export const ACCOUNT_DELETE_ERROR = (accountId: string, err?: string): string =>
  `${accountId.toUpperCase()} account does not exists${
    err ? ' -> ' + err : ''
  }.`;

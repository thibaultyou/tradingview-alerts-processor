import { messageWrapper } from './message.utils';

const databaseMessageWrapper = (messsage: string): string =>
  messageWrapper('database', messsage);

export const DATABASE_CONFIGURATION_SUCCESS = databaseMessageWrapper(
  `Database successfully configured.`
);

export const DATABASE_CONFIGURATION_ERROR = databaseMessageWrapper(
  `Unable to configure database.`
);

export const JSON_DATABASE_LOADING = databaseMessageWrapper(
  `Loading JSON database.`
);

export const REDIS_DATABASE_LOADING = databaseMessageWrapper(
  `Loading Redis database.`
);

export const DATABASE_CREATE_SUCCESS = (key: string): string =>
  databaseMessageWrapper(`${key} key succesfully created.`);

export const DATABASE_CREATE_ERROR = (key: string, err?: string): string =>
  databaseMessageWrapper(`Failed to create ${key}${err ? ' -> ' + err : ''}.`);

export const DATABASE_UPDATE_SUCCESS = (key: string): string =>
  databaseMessageWrapper(`${key} key succesfully updated.`);

export const DATABASE_UPDATE_ERROR = (key: string, err?: string): string =>
  databaseMessageWrapper(`Failed to update ${key}${err ? ' -> ' + err : ''}.`);

export const DATABASE_READ_SUCCESS = (key: string): string =>
  databaseMessageWrapper(`${key} key succesfully loaded.`);

export const DATABASE_READ_ERROR = (key: string, err?: string): string =>
  databaseMessageWrapper(`Failed to read ${key}${err ? ' -> ' + err : ''}.`);

export const DATABASE_DELETE_SUCCESS = (key: string): string =>
  databaseMessageWrapper(`${key} key succesfully deleted.`);

export const DATABASE_DELETE_ERROR = (key: string, err?: string): string =>
  databaseMessageWrapper(`Failed to delete ${key}${err ? ' -> ' + err : ''}.`);

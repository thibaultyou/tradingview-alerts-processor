export const DATABASE_CONFIGURATION_SUCCESS = `Database - Database successfully configured.`;

export const DATABASE_CONFIGURATION_ERROR = `Database - Unable to configure database.`;

export const JSON_DATABASE_LOADING = `Database - Loading JSON database.`;

export const REDIS_DATABASE_LOADING = `Database - Loading Redis database.`;

export const DATABASE_CREATE_SUCCESS = (key: string): string =>
  `Database - ${key} succesfully created.`;

export const DATABASE_CREATE_ERROR = (key: string, err?: string): string =>
  `Database - Failed to create ${key}${err ? ' -> ' + err : ''}.`;

export const DATABASE_UPDATE_SUCCESS = (key: string): string =>
  `Database - ${key} succesfully updated.`;

export const DATABASE_UPDATE_ERROR = (key: string, err?: string): string =>
  `Database - Failed to update ${key}${err ? ' -> ' + err : ''}.`;

export const DATABASE_READ_SUCCESS = (key: string): string =>
  `Database - ${key} succesfully loaded.`;

export const DATABASE_READ_ERROR = (key: string, err?: string): string =>
  `Database - Failed to read ${key}${err ? ' -> ' + err : ''}.`;

export const DATABASE_DELETE_SUCCESS = (key: string): string =>
  `Database - ${key} succesfully deleted.`;

export const DATABASE_DELETE_ERROR = (key: string, err?: string): string =>
  `Database - Failed to delete ${key}${err ? ' -> ' + err : ''}.`;

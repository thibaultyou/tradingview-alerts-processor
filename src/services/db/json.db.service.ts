import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import {
  JSON_DATABASE_NAME,
  JSON_DATABASE_ROOT_PATH
} from '../../constants/env.constants';
import {
  DATABASE_CONFIGURATION_SUCCESS,
  DATABASE_CONFIGURATION_ERROR,
  JSON_DATABASE_LOADING,
  DATABASE_READ_SUCCESS,
  DATABASE_READ_ERROR,
  DATABASE_DELETE_SUCCESS,
  DATABASE_DELETE_ERROR,
  DATABASE_CREATE_SUCCESS,
  DATABASE_CREATE_ERROR,
  DATABASE_UPDATE_SUCCESS,
  DATABASE_UPDATE_ERROR
} from '../../messages/db.messages';
import { debug, error } from '../logger.service';
import {
  DatabaseCreateError,
  DatabaseDeleteError,
  DatabaseInitError,
  DatabaseReadError,
  DatabaseUpdateError
} from '../../errors/db.errors';
import { IDatabase } from '../../interfaces/db.interfaces';

function defaultJsonDbClient(): JsonDB {
  return new JsonDB(
    new Config(JSON_DATABASE_NAME, true, true, JSON_DATABASE_ROOT_PATH)
  );
}
const defaultJsonDbClient = (): JsonDB => new JsonDB(
    new Config(JSON_DATABASE_NAME, true, true, JSON_DATABASE_ROOT_PATH)
  );
export class JSONDatabaseService implements IDatabase {
  private instance: JsonDB;

  constructor(defaultClient: () => JsonDB = defaultJsonDbClient) {
    try {
      debug(JSON_DATABASE_LOADING);
      this.instance = defaultClient();
      debug(DATABASE_CONFIGURATION_SUCCESS);
    } catch (err) {
      error(DATABASE_CONFIGURATION_ERROR, err);
      throw new DatabaseInitError(DATABASE_CONFIGURATION_ERROR);
    }
  }

  read = (key: string): unknown => {
    const path = `/${key}`;
    try {
      const value = this.instance.getData(path);
      debug(DATABASE_READ_SUCCESS(key));
      return value;
    } catch (err) {
      error(DATABASE_READ_ERROR(key, err));
      throw new DatabaseReadError(DATABASE_READ_ERROR(key, err));
    }
  };

  create = (key: string, value: unknown): unknown => {
    const path = `/${key}`;
    try {
      this.instance.push(path, value);
      debug(DATABASE_CREATE_SUCCESS(key));
    } catch (err) {
      error(DATABASE_CREATE_ERROR(key, err));
      throw new DatabaseCreateError(DATABASE_CREATE_ERROR(key, err));
    }
    return value;
  };

  update = async (key: string, updated: unknown): Promise<unknown> => {
    const path = `/${key}`;
    try {
      this.read(key);
      this.delete(key);
      this.instance.push(path, updated);
      debug(DATABASE_UPDATE_SUCCESS(key));
    } catch (err) {
      error(DATABASE_UPDATE_ERROR(key, err));
      throw new DatabaseUpdateError(DATABASE_UPDATE_ERROR(key, err));
    }
    return updated;
  };

  delete = (key: string): unknown => {
    const path = `/${key}`;
    try {
      const value = this.read(key);
      this.instance.delete(path);
      debug(DATABASE_DELETE_SUCCESS(key));
      return value;
    } catch (err) {
      error(DATABASE_DELETE_ERROR(key, err));
      throw new DatabaseDeleteError(DATABASE_DELETE_ERROR(key, err));
    }
  };
}

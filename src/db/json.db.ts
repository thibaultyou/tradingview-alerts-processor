import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import {
  JSON_DATABASE_NAME,
  JSON_DATABASE_ROOT_PATH
} from '../constants/env.constants';
import {
  DATABASE_CONFIGURATION_SUCCESS,
  DATABASE_CONFIGURATION_ERROR,
  JSON_DATABASE_LOADING
} from '../messages/db.messages';
import { DatabaseError } from '../errors/database.errors';
import { debug, error } from '../services/logger.service';
import { Account } from '../entities/account.entities';

export class JSONDatabaseService {
  private db: JsonDB;

  constructor() {
    try {
      debug(JSON_DATABASE_LOADING);
      this.db = new JsonDB(
        new Config(JSON_DATABASE_NAME, true, true, JSON_DATABASE_ROOT_PATH)
      );
      debug(DATABASE_CONFIGURATION_SUCCESS);
    } catch (err) {
      error(DATABASE_CONFIGURATION_ERROR, err);
      throw new DatabaseError(DATABASE_CONFIGURATION_ERROR);
    }
  }

  read = (key: string): Account => {
    const path = `/${key}`;
    return this.db.getData(path);
  };

  write = (key: string, account: Account): void => {
    const path = `/${key}`;
    this.db.push(path, account);
  };

  delete = (key: string): void => {
    const path = `/${key}`;
    this.db.getData(path);
    this.db.delete(path);
  };
}

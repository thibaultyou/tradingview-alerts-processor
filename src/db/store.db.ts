import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { DATABASE_NAME, DATABASE_ROOT_PATH } from '../constants/env.constants';
import {
  DATABASE_CONFIGURATION_SUCCESS,
  DATABASE_CONFIGURATION_ERROR
} from '../messages/db.messages';
import { DatabaseError } from '../errors/database.errors';
import { debug, error } from '../services/logger.service';

let database: JsonDB;

export const getDatabase = (): JsonDB => {
  if (!database) {
    try {
      database = new JsonDB(
        new Config(DATABASE_NAME, true, true, DATABASE_ROOT_PATH)
      );
      debug(DATABASE_CONFIGURATION_SUCCESS);
    } catch (err) {
      error(DATABASE_CONFIGURATION_ERROR);
      throw new DatabaseError(DATABASE_CONFIGURATION_ERROR);
    }
  }
  return database;
};

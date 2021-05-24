import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

let db: JsonDB;

export const getDatabase = (): JsonDB => {
  if (!db) {
    db = new JsonDB(new Config('db', true, true, '/'));
  }
  return db;
};

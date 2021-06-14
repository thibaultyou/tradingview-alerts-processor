import { DatabaseId } from '../constants/db.constants';
import { JSONDatabaseService } from './db/json.db.service';
import { RedisDatabaseService } from './db/redis.db.service';
import { Database } from '../types/db.types';

const DATABASE = process.env.DATABASE_TYPE || DatabaseId.JSON;

export class DatabaseService {
  private static instance: Database;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getDatabaseInstance = (): Database => {
    if (!DatabaseService.instance) {
      DatabaseService.instance =
        DATABASE === DatabaseId.REDIS
          ? new RedisDatabaseService()
          : new JSONDatabaseService();
    }
    return DatabaseService.instance;
  };
}

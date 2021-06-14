import { JSONDatabaseService } from '../db/json.db';
import { RedisDatabaseService } from '../db/redis.db';
import { Database } from '../types/db.types';

const DB = process.env.DATABASE_TYPE || 'json';

export class DatabaseService {
  private static instance: Database;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getDatabaseInstance = (): Database => {
    if (!DatabaseService.instance) {
      DatabaseService.instance =
        DB === 'redis' ? new RedisDatabaseService() : new JSONDatabaseService();
    }
    return DatabaseService.instance;
  };
}

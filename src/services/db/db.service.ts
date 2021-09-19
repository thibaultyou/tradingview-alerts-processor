import { DatabaseId } from '../../constants/db.constants';
import { JSONDatabaseService } from './json.db.service';
import { RedisDatabaseService } from './redis.db.service';
import { Database } from '../../types/db.types';

const DATABASE = process.env.DATABASE_TYPE || DatabaseId.JSON;

export class DatabaseService {
  // Might it make sense to make this abstract?
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

  public static getType = (): string => DATABASE;
}

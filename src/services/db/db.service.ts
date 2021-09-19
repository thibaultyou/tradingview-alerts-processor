import { DatabaseId } from '../../constants/db.constants';
import { JSONDatabaseService } from './json.db.service';
import { RedisDatabaseService } from './redis.db.service';
import { Database } from '../../types/db.types';
import { error } from 'winston';
import { DATABASE_CONFIGURATION_ERROR } from '../../messages/db.messages';

const DATABASE = process.env.DATABASE_TYPE || DatabaseId.JSON;

export class DatabaseService {
  private static instance: Database;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static setDatabaseType(_databaseType: string = null): void {
    if (_databaseType) {
      switch (_databaseType) {
        case DatabaseId.JSON:
          DatabaseService.instance = new JSONDatabaseService();
          break;
        case DatabaseId.REDIS:
          DatabaseService.instance = new RedisDatabaseService();
          break;
        default:
          error(DATABASE_CONFIGURATION_ERROR);
          throw new Error(DATABASE_CONFIGURATION_ERROR);
      }
    }
  }

  public static getDatabaseInstance = (): Database => {
    if (!DatabaseService.instance) {
      this.setDatabaseType(DATABASE);
    }
    return DatabaseService.instance;
  };

  public static getType = (): string => DATABASE;
}

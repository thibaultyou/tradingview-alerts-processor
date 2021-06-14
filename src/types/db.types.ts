import { JSONDatabaseService } from '../services/db/json.db.service';
import { RedisDatabaseService } from '../services/db/redis.db.service';

export type Database = RedisDatabaseService | JSONDatabaseService;

import { JSONDatabaseService } from '../db/json.db';
import { RedisDatabaseService } from '../db/redis.db';

export type Database = JSONDatabaseService | RedisDatabaseService;

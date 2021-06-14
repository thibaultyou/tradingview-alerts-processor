import { debug, error } from '../services/logger.service';
import {
  DATABASE_CONFIGURATION_ERROR,
  DATABASE_CONFIGURATION_SUCCESS,
  REDIS_DATABASE_LOADING
} from '../messages/db.messages';
import { createNodeRedisClient, WrappedNodeRedisClient } from 'handy-redis';
import { Account } from '../entities/account.entities';
import { DatabaseError } from '../errors/database.errors';
import { RedisClient } from 'redis';
import { REDIS_HOST, REDIS_PORT } from '../constants/env.constants';
import { ACCOUNT_READ_ERROR } from '../messages/account.messages';
import { AccountReadError } from '../errors/account.errors';

const PORT = process.env.REDIS_PORT || REDIS_PORT;
const HOST = process.env.REDIS_HOST || REDIS_HOST;

export class RedisDatabaseService {
  private client: WrappedNodeRedisClient;

  constructor() {
    try {
      debug(REDIS_DATABASE_LOADING);
      this.client = createNodeRedisClient(
        new RedisClient({ port: Number(PORT), host: HOST })
      );
      debug(DATABASE_CONFIGURATION_SUCCESS);
    } catch (err) {
      error(DATABASE_CONFIGURATION_ERROR, err);
      throw new DatabaseError(DATABASE_CONFIGURATION_ERROR);
    }
  }

  read = async (key: string): Promise<Account> => {
    const account = JSON.parse(await this.client.get(key));
    if (!account) {
      throw new AccountReadError(ACCOUNT_READ_ERROR(key));
    }
    return account;
  };

  write = async (key: string, account: Account): Promise<void> => {
    await this.client.set(key, JSON.stringify(account));
  };

  delete = async (key: string): Promise<void> => {
    const account = await this.client.get(key);
    if (!account) {
      throw new AccountReadError(ACCOUNT_READ_ERROR(key));
    }
    await this.client.del(key);
  };
}

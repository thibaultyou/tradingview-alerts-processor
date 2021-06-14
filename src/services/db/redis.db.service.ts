import { debug, error } from '../logger.service';
import {
  DATABASE_CONFIGURATION_ERROR,
  DATABASE_CONFIGURATION_SUCCESS,
  DATABASE_CREATE_ERROR,
  DATABASE_CREATE_SUCCESS,
  DATABASE_DELETE_ERROR,
  DATABASE_DELETE_SUCCESS,
  DATABASE_READ_ERROR,
  DATABASE_READ_SUCCESS,
  DATABASE_UPDATE_ERROR,
  DATABASE_UPDATE_SUCCESS,
  REDIS_DATABASE_LOADING
} from '../../messages/db.messages';
import { createNodeRedisClient, WrappedNodeRedisClient } from 'handy-redis';
import { RedisClient } from 'redis';
import { REDIS_HOST, REDIS_PORT } from '../../constants/env.constants';
import { BaseDatabaseService } from './base.db.service';
import {
  DatabaseCreateError,
  DatabaseDeleteError,
  DatabaseInitError,
  DatabaseReadError,
  DatabaseUpdateError
} from '../../errors/db.errors';

const PORT = process.env.REDIS_PORT || REDIS_PORT;
const HOST = process.env.REDIS_HOST || REDIS_HOST;

export class RedisDatabaseService extends BaseDatabaseService {
  private instance: WrappedNodeRedisClient;

  constructor() {
    super();
    try {
      debug(REDIS_DATABASE_LOADING);
      this.instance = createNodeRedisClient(
        new RedisClient({ port: Number(PORT), host: HOST })
      );
      debug(DATABASE_CONFIGURATION_SUCCESS);
    } catch (err) {
      error(DATABASE_CONFIGURATION_ERROR, err);
      throw new DatabaseInitError(DATABASE_CONFIGURATION_ERROR);
    }
  }

  read = async (key: string): Promise<unknown> => {
    try {
      const value = JSON.parse(await this.instance.get(key));
      if (!value) {
        throw new DatabaseReadError(DATABASE_READ_ERROR(key));
      }
      debug(DATABASE_READ_SUCCESS(key));
      return value;
    } catch (err) {
      error(DATABASE_READ_ERROR(key, err));
      throw new DatabaseReadError(DATABASE_READ_ERROR(key));
    }
  };

  create = async (key: string, value: unknown): Promise<unknown> => {
    try {
      // TODO test if value already exists before override
      await this.instance.set(key, JSON.stringify(value));
      debug(DATABASE_CREATE_SUCCESS(key));
    } catch (err) {
      error(DATABASE_CREATE_ERROR(key, err));
      throw new DatabaseCreateError(DATABASE_CREATE_ERROR(key, err));
    }
    return value;
  };

  update = async (key: string, updated: unknown): Promise<unknown> => {
    try {
      await this.read(key);
      await this.instance.set(key, JSON.stringify(updated));
      debug(DATABASE_UPDATE_SUCCESS(key));
    } catch (err) {
      error(DATABASE_UPDATE_ERROR(key, err));
      throw new DatabaseUpdateError(DATABASE_UPDATE_ERROR(key, err));
    }
    return updated;
  };

  delete = async (key: string): Promise<unknown> => {
    try {
      const value = await this.read(key);
      await this.instance.del(key);
      debug(DATABASE_DELETE_SUCCESS(key));
      return value;
    } catch (err) {
      error(DATABASE_DELETE_ERROR(key, err));
      throw new DatabaseDeleteError(DATABASE_DELETE_ERROR(key, err));
    }
  };
}
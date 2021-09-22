import { WrappedNodeRedisClient } from 'handy-redis';
import { RedisDatabaseService } from '../redis.db.service';

describe('Redis database service', () => {
  describe('constructor', () => {
    it('should apply config', () => {
      const mockClient = jest.fn();
      new RedisDatabaseService(mockClient);
      expect(mockClient).toHaveBeenCalled();
    });
  });

  describe('readKey', () => {
    it('should call get() and return parsed entry', async () => {
      const key = 'aKey';
      const value = ['value1', 'value2'];
      const storedValue = JSON.stringify(value);

      const mockGet = jest.fn(async () => storedValue);
      const mockClientCreator = () => {
        const mockInstance = {} as WrappedNodeRedisClient;
        mockInstance.get = mockGet;
        return mockInstance;
      };

      const service = new RedisDatabaseService(mockClientCreator);
      const result = await service.readKey(key);
      expect(mockGet).toHaveBeenCalledWith(key);
      expect(result).toStrictEqual(value);
    });

    it('should throw an error', async () => {
      const key = 'aKey';

      const mockGet = jest.fn(async () => {
        throw new Error();
      });
      const mockClientCreator = () => {
        const mockInstance = {} as WrappedNodeRedisClient;
        mockInstance.get = mockGet;
        return mockInstance;
      };

      const service = new RedisDatabaseService(mockClientCreator);
      await expect(service.readKey(key)).rejects.toThrow();
    });
  });

  describe('read', () => {
    it('should return entry', async () => {
      const key = 'aKey';
      const value = ['value1', 'value2'];
      const storedValue = JSON.stringify(value);

      const mockGet = jest.fn(async () => storedValue);
      const mockKeys = jest.fn(async () => [key]);
      const mockClientCreator = () => {
        const mockInstance = {} as WrappedNodeRedisClient;
        mockInstance.get = mockGet;
        mockInstance.keys = mockKeys;
        return mockInstance;
      };

      const service = new RedisDatabaseService(mockClientCreator);
      const result = await service.read(key);
      expect(mockGet).toHaveBeenCalledWith(key);
      expect(mockKeys).toHaveBeenCalledTimes(0);
      expect(result).toStrictEqual(value);
    });

    it('should return entries', async () => {
      const key = '*';
      const keys = ['aKey', 'anotherKey'];
      const value = { value1: 'value1' };
      const storedValue = JSON.stringify(value);

      const mockGet = jest.fn(async () => storedValue);
      const mockKeys = jest.fn(async () => keys);
      const mockClientCreator = () => {
        const mockInstance = {} as WrappedNodeRedisClient;
        mockInstance.get = mockGet;
        mockInstance.keys = mockKeys;
        return mockInstance;
      };

      const service = new RedisDatabaseService(mockClientCreator);
      const result = await service.read(key);
      expect(mockGet).toHaveBeenCalledTimes(2); // once for each mocked key in `keys`
      expect(mockKeys).toHaveBeenCalledWith(key);
      expect(result).toStrictEqual([value, value]);
    });

    it('should throw an error', async () => {
      const key = '*';
      const value = { value1: 'value1' };
      const storedValue = JSON.stringify(value);

      const mockGet = jest.fn(async () => storedValue);
      const mockKeys = jest.fn(async () => {
        throw new Error();
      });
      const mockClientCreator = () => {
        const mockInstance = {} as WrappedNodeRedisClient;
        mockInstance.get = mockGet;
        mockInstance.keys = mockKeys;
        return mockInstance;
      };

      const service = new RedisDatabaseService(mockClientCreator);
      await expect(service.read(key)).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create entry and return value', async () => {
      const key = 'aKey';
      const value = ['value1', 'value2'];
      const storedValue = JSON.stringify(value);

      const mockSet = jest.fn();
      const mockClientCreator = () => {
        const mockInstance = {} as WrappedNodeRedisClient;
        mockInstance.set = mockSet;
        return mockInstance;
      };

      const service = new RedisDatabaseService(mockClientCreator);
      const result = await service.create(key, value);
      expect(mockSet).toHaveBeenCalledWith(key, storedValue);
      expect(result).toStrictEqual(value);
    });

    it('should throw error', async () => {
      const key = 'aKey';
      const value = ['value1', 'value2'];

      const mockSet = jest.fn(() => {
        throw new Error();
      });
      const mockClientCreator = () => {
        const mockInstance = {} as WrappedNodeRedisClient;
        mockInstance.set = mockSet;
        return mockInstance;
      };

      const service = new RedisDatabaseService(mockClientCreator);
      await expect(service.create(key, value)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it.todo('should delete old entry');

    it.todo('should write new entry');

    it.todo('should return new entry');

    it.todo('should throw error');
  });

  describe('delete', () => {
    it.todo('should delete old entry');

    it.todo('should return old entry');

    it.todo('should throw error');
  });
});

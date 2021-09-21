import { JsonDB } from 'node-json-db';
import { JSONDatabaseService } from '../json.db.service';

describe('JSON database service', () => {
  describe('constructor', () => {
    let mockClientCreator;

    it('should apply config', () => {
      mockClientCreator = jest.fn();
      new JSONDatabaseService(mockClientCreator);
      expect(mockClientCreator).toHaveBeenCalled();
    });
  });

  describe('read', () => {
    /**
     * Confirms that the provided key is prepended with a '/',
     * and that this.instance.getData() is called with such,
     * and that its result is returned.
     */
    it('should return entry', () => {
      const key = 'aKey';
      const value = 'someData';
      const mockGetData = jest.fn(() => value);
      const mockClientCreator = () => {
        const mockInstance = {} as JsonDB;
        mockInstance.getData = mockGetData;
        return mockInstance;
      };
      const service = new JSONDatabaseService(mockClientCreator);

      const result = service.read(key);
      expect(mockGetData).toHaveBeenCalledWith(`/${key}`);
      expect(result).toEqual(value);
    });

    /**
     * Confirms that an errow thrown by this.instance.getData() is propagated.
     */
    it('should return error', () => {
      const mockGetData = jest.fn(() => {
        throw new Error();
      });
      const mockClientCreator = () => {
        const mockInstance = {} as JsonDB;
        mockInstance.getData = mockGetData;
        return mockInstance;
      };
      const service = new JSONDatabaseService(mockClientCreator);

      const key = 'aKey';
      expect(() => {
        service.read(key);
      }).toThrow();
    });
  });

  describe('create', () => {
    /**
     * Confirms that the provided key is prepended with a '/',
     * and that this.instance.push() is called with such,
     * and that the provided value is returned.
     */
    it('should create entry and return entry', () => {
      const key = 'aKey';
      const value = 'someValue';

      const mockPush = jest.fn(() => value);
      const mockClientCreator = () => {
        const mockInstance = {} as JsonDB;
        mockInstance.push = mockPush;
        return mockInstance;
      };
      const service = new JSONDatabaseService(mockClientCreator);

      service.create(key, value);
      expect(mockPush).toHaveBeenCalledWith(`/${key}`, value);
      expect(value).toEqual(value);
    });

    it('should return error', () => {
      const mockPush = jest.fn(() => {
        throw new Error();
      });
      const mockClientCreator = () => {
        const mockInstance = {} as JsonDB;
        mockInstance.getData = mockPush;
        return mockInstance;
      };
      const service = new JSONDatabaseService(mockClientCreator);

      const key = 'aKey';
      const value = 'someValue';
      expect(() => {
        service.create(key, value);
      }).toThrow();
    });
  });

  describe('update', () => {
    it('should delete old entry', async () => {
      const key = 'aKey';
      const value = 'someValue';
      const newValue = 'newValue';

      const mockGetData = jest.fn();
      const mockDelete = jest.fn(() => value);
      const mockPush = jest.fn();
      const mockClientCreator = () => {
        const mockInstance = {} as JsonDB;
        mockInstance.getData = mockGetData;
        mockInstance.delete = mockDelete;
        mockInstance.push = mockPush;
        return mockInstance;
      };
      const service = new JSONDatabaseService(mockClientCreator);

      await service.update(key, newValue);
      expect(mockDelete).toHaveBeenCalledWith(`/${key}`);
    });

    it('should write new entry and return new value', async () => {
      const key = 'aKey';
      const newValue = 'newValue';

      const mockGetData = jest.fn();
      const mockDelete = jest.fn();
      const mockPush = jest.fn();
      const mockClientCreator = () => {
        const mockInstance = {} as JsonDB;
        mockInstance.getData = mockGetData;
        mockInstance.delete = mockDelete;
        mockInstance.push = mockPush;
        return mockInstance;
      };
      const service = new JSONDatabaseService(mockClientCreator);

      const result = await service.update(key, newValue);
      expect(mockPush).toHaveBeenCalledWith(`/${key}`, newValue);
      expect(result).toEqual(newValue);
    });

    it('should return error', async () => {
      const key = 'aKey';
      const newValue = 'newValue';

      const mockGetData = jest.fn();
      const mockDelete = jest.fn();
      const mockPush = jest.fn(() => {
        throw new Error();
      });
      const mockClientCreator = () => {
        const mockInstance = {} as JsonDB;
        mockInstance.getData = mockGetData;
        mockInstance.delete = mockDelete;
        mockInstance.push = mockPush;
        return mockInstance;
      };
      const service = new JSONDatabaseService(mockClientCreator);

      await expect(service.update(key, newValue)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete old entry and return old entry', () => {
      const key = 'deleteMe';
      const value = 'outdatedInfo';

      const mockGetData = jest.fn(() => value);
      const mockDelete = jest.fn(() => value);
      const mockClientCreator = () => {
        const mockInstance = {} as JsonDB;
        mockInstance.getData = mockGetData;
        mockInstance.delete = mockDelete;
        return mockInstance;
      };
      const service = new JSONDatabaseService(mockClientCreator);

      service.delete(key);
      expect(mockDelete).toHaveBeenCalledWith(`/${key}`);
      expect(value).toEqual(value);
    });

    it('should return error', () => {
      const mockDelete = jest.fn(() => {
        throw new Error();
      });
      const mockClientCreator = () => {
        const mockInstance = {} as JsonDB;
        mockInstance.delete = mockDelete;
        return mockInstance;
      };
      const service = new JSONDatabaseService(mockClientCreator);

      const key = 'aKey';
      expect(() => {
        service.delete(key);
      }).toThrow();
    });
  });
});

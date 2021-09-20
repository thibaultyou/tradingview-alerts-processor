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
      const mockGetData = jest.fn(() => 'someData');
      const mockClientCreator = () => {
        const mockInstance = {} as JsonDB;
        mockInstance.getData = mockGetData;
        return mockInstance;
      };
      const service = new JSONDatabaseService(mockClientCreator);

      const key = 'aKey';
      const result = service.read(key);
      expect(mockGetData).toHaveBeenCalledWith(`/${key}`);
      expect(result).toEqual('someData');
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
    it.todo('should delete old entry');

    it.todo('should write new entry');

    it.todo('should return new entry');

    it.todo('should return error');
  });

  describe('delete', () => {
    it.todo('should delete old entry');

    it.todo('should return old entry');

    it.todo('should return error');
  });
});

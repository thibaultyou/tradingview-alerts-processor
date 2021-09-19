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

      const key = 'aKey';
      const service = new JSONDatabaseService(mockClientCreator);
      const result = service.read(key);
      expect(mockGetData).toHaveBeenCalledWith(`/${key}`);
      expect(result).toEqual('someData');
    });

    it('should return error', () => {
      const mockGetData = jest.fn(() => {
        throw new Error();
      });

      const mockClientCreator = () => {
        const mockInstance = {} as JsonDB;
        mockInstance.getData = mockGetData;
        return mockInstance;
      };

      const key = 'aKey';
      const service = new JSONDatabaseService(mockClientCreator);
      expect(() => {
        service.read(key);
      }).toThrow();
    });
  });

  describe('write', () => {
    it.todo('should create entry');

    it.todo('should return entry');

    it.todo('should return error');
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

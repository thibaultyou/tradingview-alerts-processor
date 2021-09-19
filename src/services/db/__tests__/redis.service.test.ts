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
    it.todo('should return entry');

    it.todo('should return error');
  });

  describe('read', () => {
    it.todo('should return entry');

    it.todo('should return entries');

    it.todo('should return error');
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

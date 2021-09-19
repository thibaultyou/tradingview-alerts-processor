import { JSONDatabaseService } from '../json.db.service';

describe('JSON database service', () => {
  describe('constructor', () => {
    it('should apply config', () => {
      const mockClient = jest.fn();
      new JSONDatabaseService(mockClient);
      expect(mockClient).toHaveBeenCalled();
    });
  });

  describe('read', () => {
    it.todo('should return entry');

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

import { DatabaseError } from '../../errors/database.errors';
import { getDatabase } from '../store.db';

jest.mock('node-json-db', () => {
  jest.fn().mockImplementation(() => {
    throw new Error();
  });
});

describe('Database', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDatabase', () => {
    it('should throw on bad configuration', async () => {
      expect(() => getDatabase()).toThrow(DatabaseError);
    });
  });
});

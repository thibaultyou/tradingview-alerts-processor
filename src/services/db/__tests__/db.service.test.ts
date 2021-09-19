import { DATABASE_CONFIGURATION_ERROR } from '../../../messages/db.messages';
import { DatabaseId } from '../../../constants/db.constants';
import { DatabaseService } from '../db.service';
import { JSONDatabaseService } from '../json.db.service';
import { RedisDatabaseService } from '../redis.db.service';

describe('Database service', () => {
  describe('setDatabaseType', () => {
    it('should set the database type', () => {
      expect(() => {
        DatabaseService.setDatabaseType(DatabaseId.JSON);
      }).not.toThrow();
    });

    it('should throw an error for a missing or unrecognized database type', () => {
      expect(() => {
        DatabaseService.setDatabaseType('sider');
      }).toThrow(DATABASE_CONFIGURATION_ERROR);
    });
  });

  describe('getDatabaseInstance', () => {
    it('should return RedisDatabaseService instance when Redis is set', () => {
      DatabaseService.setDatabaseType(DatabaseId.REDIS);
      expect(DatabaseService.getDatabaseInstance()).toBeInstanceOf(
        RedisDatabaseService
      );
    });

    it('should return JSONDatabaseService instance when JSON is set', () => {
      DatabaseService.setDatabaseType(DatabaseId.JSON);
      expect(DatabaseService.getDatabaseInstance()).toBeInstanceOf(
        JSONDatabaseService
      );
    });
  });

  describe('getType', () => {
    it('should return database type', () => {
      const supportedDatabaseTypes = [
        DatabaseId.REDIS.toString(),
        DatabaseId.JSON.toString()
      ];
      expect(
        supportedDatabaseTypes.includes(DatabaseService.getType())
      ).toBeTruthy();
    });
  });
});

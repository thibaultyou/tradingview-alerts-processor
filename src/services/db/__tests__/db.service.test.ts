import { DatabaseId } from '../../../constants/db.constants';
import { DatabaseService } from '../db.service';

describe('Database service', () => {
  // describe('setDatabaseType', () => {
  //   it('should set the database type', () => {
  //     expect(() => {
  //       DatabaseService.setDatabaseType(DatabaseId.JSON);
  //     }).not.toThrow();
  //   });

  //   it('should throw an error for a missing or unrecognized database type', () => {
  //     expect(() => {
  //       DatabaseService.setDatabaseType('sider');
  //     }).toThrow(DATABASE_CONFIGURATION_ERROR);
  //   });
  // });

  describe('getDatabaseInstance', () => {
    /**
     * Testing the getter is conditional on being able to set it to different values.
     * Potential approaches to this include:
     * - Change process.env.DATABASE_TYPE (because that's the current way its done)
     * - Refactor DatabaseService to have a setter for the database type.
     *      (This was attempted, but it ran into problems with circular dependencies.
     *       It may work, but I'm focusing elsewhere for now.)
     * - Refactor DatabaseService to use an singleton pattern with some kind of DI
     * - Refactor DatabaseService to use a factory pattern with some kind of DI
     * - Other?
     */
    it.todo('should return RedisDatabaseService instance when Redis is set');
    // it('should return RedisDatabaseService instance when Redis is set', () => {
    //   DatabaseService.setDatabaseType(DatabaseId.REDIS);
    //   expect(DatabaseService.getDatabaseInstance()).toBeInstanceOf(
    //     RedisDatabaseService
    //   );
    // });

    it.todo('should return JSONDatabaseService instance when JSON is set');
    // it('should return JSONDatabaseService instance when JSON is set', () => {
    //   DatabaseService.setDatabaseType(DatabaseId.JSON);
    //   expect(DatabaseService.getDatabaseInstance()).toBeInstanceOf(
    //     JSONDatabaseService
    //   );
    // });
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

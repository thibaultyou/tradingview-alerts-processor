import { writeAccount, readAccount, removeAccount } from '../account.service';
import { sampleAccount, sampleSubaccount } from '../../../tests/tests.fixtures';
import {
  AccountReadError,
  AccountWriteError
} from '../../errors/account.errors';
import { clearTestingDatabase } from '../../../tests/tests.utils';

describe('Account service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearTestingDatabase();
  });

  describe('writeAccount', () => {
    it('should add account to database', () => {
      expect(writeAccount(sampleAccount)).toBe(sampleAccount);
    });

    it('should add subaccount to database', () => {
      expect(writeAccount(sampleSubaccount)).toBe(sampleSubaccount);
    });

    it('should throw if account exists', () => {
      writeAccount(sampleAccount);
      expect(() => writeAccount(sampleAccount)).toThrow(AccountWriteError);
    });
  });

  describe('readAccount', () => {
    it('should read account from database', () => {
      writeAccount(sampleAccount);
      expect(readAccount(sampleAccount.stub)).toBe(sampleAccount);
    });

    it('should throw if account does not exists', () => {
      expect(() => readAccount(sampleAccount.stub)).toThrow(AccountReadError);
    });
  });

  describe('removeAccount', () => {
    it('should remove account from database', () => {
      writeAccount(sampleAccount);
      expect(removeAccount(sampleAccount.stub)).toBeTruthy();
    });

    it('should throw if account does not exists', () => {
      expect(() => removeAccount(sampleAccount.stub)).toThrow(
        AccountWriteError
      );
    });
  });
});

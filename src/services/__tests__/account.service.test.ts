import { writeAccount, readAccount, removeAccount } from '../account.service';
import { sampleAccount, sampleSubaccount } from '../../../tests/tests.fixtures';
import {
  AccountReadError,
  AccountWriteError
} from '../../errors/account.errors';
import { clearTestingDatabase } from '../../../tests/tests.utils';
import * as echangeService from '../exchange.service';

describe('Account service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearTestingDatabase();
  });

  describe('writeAccount', () => {
    it('should add account to database', async () => {
      jest
        .spyOn(echangeService, 'refreshExchange')
        .mockImplementationOnce(() => null);
      const res = await writeAccount(sampleAccount);
      expect(res).toBe(sampleAccount);
    });

    it('should add subaccount to database', async () => {
      jest
        .spyOn(echangeService, 'refreshExchange')
        .mockImplementationOnce(() => null);
      const res = await writeAccount(sampleSubaccount);
      expect(res).toBe(sampleSubaccount);
    });

    it.skip('should throw if account exists', async () => {
      jest
        .spyOn(echangeService, 'refreshExchange')
        .mockImplementation(() => null);
      await writeAccount(sampleAccount);
      expect(() => writeAccount(sampleAccount)).toThrow(AccountWriteError);
    });

    it.skip('should throw if account credentials are invalid', async () => {
      jest
        .spyOn(echangeService, 'refreshExchange')
        .mockImplementationOnce(() => {
          throw new Error();
        });
      await writeAccount(sampleAccount);
      expect(() => writeAccount(sampleAccount)).toThrow(AccountWriteError);
    });
  });

  describe('readAccount', () => {
    it.skip('should read account from database', () => {
      writeAccount(sampleAccount);
      expect(readAccount(sampleAccount.stub)).toBe(sampleAccount);
    });

    it.skip('should throw if account does not exists', () => {
      expect(() => readAccount(sampleAccount.stub)).toThrow(AccountReadError);
    });
  });

  describe('removeAccount', () => {
    it.skip('should remove account from database', () => {
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

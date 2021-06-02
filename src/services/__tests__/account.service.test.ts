import {
  writeAccount,
  readAccount,
  removeAccount,
  checkAccountCredentials,
  getAccountBalances
} from '../account.service';
import {
  sampleAccount,
  sampleSubaccount,
  sampleFTXExchangeOptions,
  sampleBalances,
  sampleBalance
} from '../../../tests/tests.fixtures';
import ccxt = require('ccxt');

import {
  AccountReadError,
  AccountWriteError
} from '../../errors/account.errors';
import { clearTestingDatabase } from '../../../tests/tests.utils';
import * as exchangeService from '../exchange.service';
import * as accountService from '../account.service';
import {
  BalancesFetchError,
  ExchangeInstanceInitError
} from '../../errors/exchange.errors';

describe('Account service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearTestingDatabase();
  });

  describe('writeAccount', () => {
    it('should add account to database', async () => {
      jest
        .spyOn(exchangeService, 'refreshExchange')
        .mockImplementationOnce(() => null);
      const res = await writeAccount(sampleAccount);
      expect(res).toEqual(sampleAccount);
    });

    it('should add subaccount to database', async () => {
      jest
        .spyOn(exchangeService, 'refreshExchange')
        .mockImplementationOnce(() => null);
      const res = await writeAccount(sampleSubaccount);
      expect(res).toEqual(sampleSubaccount);
    });

    it('should throw if account exists', async () => {
      jest
        .spyOn(exchangeService, 'refreshExchange')
        .mockImplementation(() => null);
      await writeAccount(sampleAccount);
      await expect(writeAccount(sampleAccount)).rejects.toThrow(
        AccountWriteError
      );
    });

    it('should throw if account credentials are invalid', async () => {
      jest
        .spyOn(exchangeService, 'refreshExchange')
        .mockImplementationOnce(() => {
          throw new Error();
        });
      await expect(writeAccount(sampleAccount)).rejects.toThrow(
        AccountWriteError
      );
    });
  });

  describe('readAccount', () => {
    it('should read account from database', async () => {
      await writeAccount(sampleAccount);
      expect(readAccount(sampleAccount.stub)).toEqual(sampleAccount);
    });

    it('should throw if account does not exists', () => {
      expect(() => readAccount(sampleAccount.stub)).toThrow(AccountReadError);
    });
  });

  describe('removeAccount', () => {
    it('should remove account from database', async () => {
      await writeAccount(sampleAccount);
      expect(removeAccount(sampleAccount.stub)).toBeTruthy();
    });

    it('should throw if account does not exists', () => {
      expect(() => removeAccount(sampleAccount.stub)).toThrow(
        AccountWriteError
      );
    });
  });

  describe('checkAccountCredentials', () => {
    it('should return true', async () => {
      jest
        .spyOn(accountService, 'getAccountBalances')
        .mockImplementationOnce(() => null);
      const instance = new ccxt.ftx(sampleFTXExchangeOptions);
      const res = await checkAccountCredentials(instance, sampleAccount);
      expect(res).toBeTruthy();
    });

    it('should throw if account credentials are invalid', async () => {
      jest
        .spyOn(accountService, 'getAccountBalances')
        .mockImplementationOnce(() => {
          throw new Error();
        });
      const instance = new ccxt.ftx(sampleFTXExchangeOptions);
      await expect(
        checkAccountCredentials(instance, sampleAccount)
      ).rejects.toThrow(ExchangeInstanceInitError);
    });
  });

  describe('getAccountBalances', () => {
    it('should return balances', async () => {
      const instance = new ccxt.ftx(sampleFTXExchangeOptions);
      jest
        .spyOn(instance, 'fetch_balance')
        .mockImplementationOnce(() => sampleBalances);
      const res = await getAccountBalances(instance, sampleAccount);
      expect(res).toEqual([sampleBalance]);
    });

    it("should throw if balances can't be fetched", async () => {
      const instance = new ccxt.ftx(sampleFTXExchangeOptions);
      jest.spyOn(instance, 'fetch_balance').mockImplementationOnce(() => {
        throw new Error();
      });
      await expect(getAccountBalances(instance, sampleAccount)).rejects.toThrow(
        BalancesFetchError
      );
    });
  });
});

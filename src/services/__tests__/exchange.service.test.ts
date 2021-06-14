import {
  sampleAccount,
  sampleSymbol,
  sampleMarket,
  invalidMarket,
  invalidSymbol
} from '../../tests/tests.fixtures';
import {
  fetchAvailableMarkets,
  fetchTickerInfo,
  getExchange,
  refreshExchange
} from '../exchange.service';
import * as accountService from '../account.service';
import {
  ExchangeInstanceInitError,
  MarketsFetchError,
  TickerFetchError
} from '../../errors/exchange.errors';

describe('Exchange service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getExchange', () => {
    it('should return exchange instance', async () => {
      jest
        .spyOn(accountService, 'checkAccountCredentials')
        .mockImplementationOnce(async () => true);
      const instance = await getExchange(sampleAccount);
      expect(instance).toBeDefined();
    });

    it('should throw if account credentials are invalid', async () => {
      jest
        .spyOn(accountService, 'checkAccountCredentials')
        .mockImplementationOnce(async () => {
          throw new ExchangeInstanceInitError('test');
        });
      await expect(getExchange(sampleAccount)).rejects.toThrow(
        ExchangeInstanceInitError
      );
    });

    it('should apply exchange generic configuration', async () => {
      jest
        .spyOn(accountService, 'checkAccountCredentials')
        .mockImplementationOnce(async () => true);
      const instance = await getExchange(sampleAccount);
      expect(instance.apiKey).toEqual(sampleAccount.apiKey);
      expect(instance.secret).toEqual(sampleAccount.secret);
    });
  });

  describe('refreshExchange', () => {
    it('should throw if account credentials are invalid', async () => {
      jest
        .spyOn(accountService, 'checkAccountCredentials')
        .mockImplementationOnce(async () => {
          throw new ExchangeInstanceInitError('test');
        });
      await expect(refreshExchange(sampleAccount)).rejects.toThrow(
        ExchangeInstanceInitError
      );
    });

    it('should return exchange instance', async () => {
      jest
        .spyOn(accountService, 'checkAccountCredentials')
        .mockImplementationOnce(async () => true)
        .mockImplementationOnce(async () => true);
      const expected = await getExchange(sampleAccount);
      const instance = await refreshExchange(sampleAccount);
      expect(JSON.stringify(expected)).toStrictEqual(JSON.stringify(instance));
    });
  });

  describe('fetchTickerPrice', () => {
    it('should return ticker informations', async () => {
      jest
        .spyOn(accountService, 'checkAccountCredentials')
        .mockImplementationOnce(async () => true)
        .mockImplementationOnce(async () => true);
      const instance = await getExchange(sampleAccount);
      const ticker = await fetchTickerInfo(
        instance,
        sampleAccount,
        sampleSymbol
      );
      expect(ticker).toBeDefined();
    });

    it("should throw if ticker can't be fetched", async () => {
      jest
        .spyOn(accountService, 'checkAccountCredentials')
        .mockImplementationOnce(async () => true)
        .mockImplementationOnce(async () => true);
      const instance = await getExchange(sampleAccount);
      await expect(
        fetchTickerInfo(instance, sampleAccount, invalidSymbol)
      ).rejects.toThrow(TickerFetchError);
    });
  });

  describe('fetchAvailableMarkets', () => {
    it('should return markets informations', async () => {
      const markets = await fetchAvailableMarkets(sampleMarket);
      expect(markets).toBeDefined();
    });

    it(`should throw if markets can't be fetched`, async () => {
      await expect(fetchAvailableMarkets(invalidMarket)).rejects.toThrow(
        MarketsFetchError
      );
    });
  });

  describe('getTickerCurrentBalance', () => {
    it.skip('should return specified ticker current balance / position size', async () => {
      expect(true).toBe(false);
    });

    it.skip(`should throw if markets can't be fetched`, async () => {
      expect(true).toBe(false);
    });
  });
});

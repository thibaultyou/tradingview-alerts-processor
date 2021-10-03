import { Account } from '../../../entities/account.entities';
import {
  ExchangeId,
  FTX_SUBACCOUNT_HEADER
} from '../../../constants/exchanges.constants';
import {
  getExchangeName,
  getExchangeOptions,
  initExchangeService,
  isSpotExchange
} from '../common.utils';
import {
  BinanceFuturesUSDMExchangeService,
  BinanceSpotExchangeService,
  BinanceUSSpotExchangeService,
  FTXExchangeService,
  KrakenExchangeService,
  KuCoinExchangeService
} from '../../../services/exchanges';
import { Ticker } from 'ccxt';

describe('Common utils', () => {
  describe('getExchangeName', () => {
    it('should return name', () => {
      expect(getExchangeName(ExchangeId.FTX)).toBe('FTX');
      expect(getExchangeName(ExchangeId.Binance)).toBe('Binance');
      expect(getExchangeName(ExchangeId.BinanceUS)).toBe('BinanceUS');
      expect(getExchangeName(ExchangeId.BinanceFuturesUSD)).toBe(
        'BinanceFutures'
      );
      expect(getExchangeName(ExchangeId.KuCoin)).toBe('KuCoin');
      expect(getExchangeName(ExchangeId.Kraken)).toBe('Kraken');
    });
  });

  describe('getExchangeOptions', () => {
    it('should return options', () => {
      const mockAccount = {
        apiKey: 'aP1K3Y',
        secret: '+3cR3s',
        passphrase: 'aSecurePassphrase'
      } as Account;
      expect(getExchangeOptions(ExchangeId.Binance, mockAccount)).toEqual({
        apiKey: mockAccount.apiKey,
        secret: mockAccount.secret
      });
      expect(
        getExchangeOptions(ExchangeId.BinanceFuturesUSD, mockAccount)
      ).toEqual({
        apiKey: mockAccount.apiKey,
        secret: mockAccount.secret
      });
      expect(getExchangeOptions(ExchangeId.BinanceUS, mockAccount)).toEqual({
        apiKey: mockAccount.apiKey,
        secret: mockAccount.secret
      });
      expect(getExchangeOptions(ExchangeId.FTX, mockAccount)).toEqual({
        apiKey: mockAccount.apiKey,
        secret: mockAccount.secret
      });

      mockAccount.subaccount = 'aSubAccount';
      expect(getExchangeOptions(ExchangeId.FTX, mockAccount)).toEqual({
        apiKey: mockAccount.apiKey,
        secret: mockAccount.secret,
        headers: {
          [FTX_SUBACCOUNT_HEADER]: mockAccount.subaccount
        }
      });

      expect(getExchangeOptions(ExchangeId.KuCoin, mockAccount)).toEqual({
        apiKey: mockAccount.apiKey,
        secret: mockAccount.secret,
        password: mockAccount.passphrase
      });

      delete mockAccount.passphrase;
      expect(getExchangeOptions(ExchangeId.KuCoin, mockAccount)).toEqual({
        apiKey: mockAccount.apiKey,
        secret: mockAccount.secret,
        password: undefined
      });
    });
  });

  describe('initExchangeService', () => {
    it('should return exchange service', () => {
      expect(initExchangeService(ExchangeId.Binance)).toBeInstanceOf(
        BinanceSpotExchangeService
      );
      expect(initExchangeService(ExchangeId.BinanceFuturesUSD)).toBeInstanceOf(
        BinanceFuturesUSDMExchangeService
      );
      expect(initExchangeService(ExchangeId.BinanceUS)).toBeInstanceOf(
        BinanceUSSpotExchangeService
      );
      expect(initExchangeService(ExchangeId.Kraken)).toBeInstanceOf(
        KrakenExchangeService
      );
      expect(initExchangeService(ExchangeId.KuCoin)).toBeInstanceOf(
        KuCoinExchangeService
      );
      expect(initExchangeService(ExchangeId.FTX)).toBeInstanceOf(
        FTXExchangeService
      );
      expect(initExchangeService('unexpected' as ExchangeId)).toBeInstanceOf(
        FTXExchangeService
      );
    });
  });

  describe('isSpotExchange', () => {
    it('should return true', () => {
      expect(isSpotExchange(null, ExchangeId.Binance)).toBeTruthy();
      expect(isSpotExchange(null, ExchangeId.BinanceUS)).toBeTruthy();
      const mockTicker = { info: { type: 'spot' } } as Ticker;
      expect(isSpotExchange(mockTicker, ExchangeId.FTX)).toBeTruthy();
      expect(isSpotExchange(null, ExchangeId.Kraken)).toBeTruthy();
      expect(isSpotExchange(null, ExchangeId.KuCoin)).toBeTruthy();
    });

    it('should return false', () => {
      expect(isSpotExchange(null, ExchangeId.BinanceFuturesUSD)).toBeFalsy();
      const mockTicker = { info: { type: 'future' } } as Ticker;
      expect(isSpotExchange(mockTicker, ExchangeId.FTX)).toBeFalsy();
      mockTicker.info.type = 'sp0t';
      expect(isSpotExchange(mockTicker, ExchangeId.FTX)).toBeFalsy();
      delete mockTicker.info.type;
      expect(isSpotExchange(mockTicker, ExchangeId.FTX)).toBeFalsy();
      expect(isSpotExchange(null, 'unexpected' as ExchangeId)).toBeFalsy();
    });
  });
});

import { Ticker } from 'ccxt';
import { ExchangeId } from '../../../constants/exchanges.constants';
import { getTickerPrice } from '../ticker.utils';

describe('Ticker utils', () => {
  describe('getTickerPrice', () => {
    const mockTicker = {} as Ticker;

    beforeEach(() => {
      mockTicker.last = 11;
      mockTicker.info = {
        lastPrice: 12,
        price: 13
      };
    });

    it('should return Binance price', () => {
      expect(getTickerPrice(mockTicker, ExchangeId.Binance)).toEqual(12);
      expect(getTickerPrice(mockTicker, ExchangeId.BinanceUS)).toEqual(12);
      expect(getTickerPrice(mockTicker, ExchangeId.BinanceFuturesUSD)).toEqual(
        12
      );
    });

    it('should return KuCoin price', () => {
      expect(getTickerPrice(mockTicker, ExchangeId.KuCoin)).toEqual(11);
    });

    it('should return Kraken price', () => {
      expect(getTickerPrice(mockTicker, ExchangeId.Kraken)).toEqual(11);
    });

    it('should return FTX price', () => {
      expect(getTickerPrice(mockTicker, ExchangeId.FTX)).toEqual(13);
    });
  });
});

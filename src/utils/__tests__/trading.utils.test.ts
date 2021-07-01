import { Side } from '../../constants/trading.constants';
import { sampleFTXTicker } from '../../tests/fixtures/ftx.fixtures';
import { sampleBinanceTicker } from '../../tests/fixtures/binance.fixtures';
import {
  getTradeSize,
  getCloseOrderSize,
  getInvertedTradeSide,
  getTradeSide
} from '../trading.utils';

describe('Trading utils', () => {
  describe('getTradeSide', () => {
    it('should return buy side', () => {
      expect(getTradeSide(Side.Buy)).toEqual(Side.Buy);
      expect(getTradeSide(Side.Long)).toEqual(Side.Buy);
    });

    it('should return sell side', () => {
      expect(getTradeSide(Side.Sell)).toEqual(Side.Sell);
      expect(getTradeSide(Side.Short)).toEqual(Side.Sell);
    });

    it('should return close side', () => {
      expect(getTradeSide(Side.Close)).toEqual(Side.Close);
    });
  });

  describe('getInvertedTradeSide', () => {
    it('should return inverted side', () => {
      expect(getInvertedTradeSide(Side.Buy)).toEqual(Side.Sell);
      expect(getInvertedTradeSide(Side.Sell)).toEqual(Side.Buy);
    });
  });

  describe('getTradeSize', () => {
    it('should return trade size for Binance tickers', () => {
      expect(getTradeSize(sampleBinanceTicker, 50)).toEqual(210.19001177064067);
    });

    it('should return trade size for FTX', () => {
      expect(getTradeSize(sampleFTXTicker, 50)).toEqual(210.75481838203527);
    });
  });

  describe('getCloseOrderSize', () => {
    it('should return close order size if percent size is provided', () => {
      expect(getCloseOrderSize(sampleFTXTicker, '33%', 100)).toEqual(33);
    });

    it('should return 100% if absolute size is provided', () => {
      expect(getCloseOrderSize(sampleFTXTicker, '123', 100)).toEqual(100);
    });

    it('should return 100% if nothing is provided', () => {
      expect(getCloseOrderSize(sampleFTXTicker, undefined, 100)).toEqual(100);
    });
  });
});

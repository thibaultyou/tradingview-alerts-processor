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
    it('should return trade size with high / low', () => {
      expect(getTradeSize(sampleBinanceTicker, 50)).toEqual(205.7316847367663);
    });

    it('should return trade size with bid / ask', () => {
      expect(getTradeSize(sampleFTXTicker, 50)).toEqual(210.73416622500298);
    });
  });

  describe('getCloseOrderSize', () => {
    it('should return close order size if percent size is provided', () => {
      expect(getCloseOrderSize('33%', 100)).toEqual(33);
    });

    it('should return 100% if absolute size is provided', () => {
      expect(getCloseOrderSize('123', 100)).toEqual(100);
    });

    it('should return 100% if nothing is provided', () => {
      expect(getCloseOrderSize(undefined, 100)).toEqual(100);
    });
  });
});

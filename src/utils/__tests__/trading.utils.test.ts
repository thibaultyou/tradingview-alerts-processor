import { Side } from '../../constants/trading.constants';
import { getInvertedTradeSide, getTradeSide } from '../trading.utils';

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
});

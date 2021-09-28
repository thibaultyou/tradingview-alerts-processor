import { Side } from '../../../constants/trading.constants';
import { getInvertedSide, getSide, isSideDifferent } from '../side.utils';

describe('Side utils', () => {
  describe('getSide', () => {
    it('should return Close', () => {
      expect(getSide(Side.Close)).toBe(Side.Close);
    });

    it('should return Sell', () => {
      expect(getSide(Side.Sell)).toBe(Side.Sell);
      expect(getSide(Side.Short)).toBe(Side.Sell);
    });

    it('should return Buy', () => {
      expect(getSide(Side.Buy)).toBe(Side.Buy);
      expect(getSide(Side.Long)).toBe(Side.Buy);

      const unexpected = 'string' as Side;
      expect(getSide(unexpected)).toBe(Side.Buy);
    });
  });

  describe('getInvertedSide', () => {
    it('should return Sell', () => {
      expect(getInvertedSide(Side.Buy)).toBe(Side.Sell);
      expect(getInvertedSide(Side.Close)).toBe(Side.Sell);
      expect(getInvertedSide(Side.Long)).toBe(Side.Sell);

      const unexpected = 'string' as Side;
      expect(getInvertedSide(unexpected)).toBe(Side.Sell);
    });

    it('should return Buy', () => {
      expect(getInvertedSide(Side.Sell)).toBe(Side.Buy);
      expect(getInvertedSide(Side.Short)).toBe(Side.Buy);
    });
  });

  describe('isSideDifferent', () => {
    it('should return true', () => {
      expect(isSideDifferent(Side.Buy, Side.Sell)).toBe(true);
      expect(isSideDifferent(Side.Buy, Side.Short)).toBe(true);
      expect(isSideDifferent(Side.Buy, Side.Close)).toBe(true);
      expect(isSideDifferent(Side.Sell, Side.Buy)).toBe(true);
      expect(isSideDifferent(Side.Sell, Side.Long)).toBe(true);
      expect(isSideDifferent(Side.Sell, Side.Close)).toBe(true);
      expect(isSideDifferent(Side.Short, Side.Buy)).toBe(true);
      expect(isSideDifferent(Side.Short, Side.Long)).toBe(true);
      expect(isSideDifferent(Side.Short, Side.Close)).toBe(true);
      expect(isSideDifferent(Side.Long, Side.Sell)).toBe(true);
      expect(isSideDifferent(Side.Long, Side.Short)).toBe(true);
      expect(isSideDifferent(Side.Long, Side.Close)).toBe(true);
      expect(isSideDifferent(Side.Close, Side.Buy)).toBe(true);
      expect(isSideDifferent(Side.Close, Side.Sell)).toBe(true);
      expect(isSideDifferent(Side.Close, Side.Short)).toBe(true);
      expect(isSideDifferent(Side.Close, Side.Long)).toBe(true);

      const unexpected = 'string' as Side;
      expect(isSideDifferent(Side.Sell, unexpected)).toBe(true);
      expect(isSideDifferent(Side.Short, unexpected)).toBe(true);
      expect(isSideDifferent(Side.Close, unexpected)).toBe(true);
      expect(isSideDifferent(unexpected, Side.Sell)).toBe(true);
      expect(isSideDifferent(unexpected, Side.Short)).toBe(true);
      expect(isSideDifferent(unexpected, Side.Close)).toBe(true);
    });

    it('should return false', () => {
      expect(isSideDifferent(Side.Buy, Side.Long)).toBe(false);
      expect(isSideDifferent(Side.Sell, Side.Short)).toBe(false);
      expect(isSideDifferent(Side.Short, Side.Sell)).toBe(false);
      expect(isSideDifferent(Side.Long, Side.Buy)).toBe(false);

      const unexpected = 'string' as Side;
      expect(isSideDifferent(unexpected, Side.Buy)).toBe(false);
      expect(isSideDifferent(Side.Buy, unexpected)).toBe(false);
      expect(isSideDifferent(Side.Long, unexpected)).toBe(false);
      expect(isSideDifferent(unexpected, Side.Long)).toBe(false);
      expect(isSideDifferent(unexpected, unexpected)).toBe(false);
    });
  });
});

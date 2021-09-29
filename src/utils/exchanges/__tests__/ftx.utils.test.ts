import { Ticker } from 'ccxt';
import { isFTXSpot } from '../ftx.utils';

describe('FTX utils', () => {
  describe('isFTXSpot', () => {
    it('should return true', () => {
      const mockTicker = { info: { type: 'spot' } } as Ticker;
      expect(isFTXSpot(mockTicker)).toBeTruthy();
    });

    it('should return false', () => {
      const mockTicker = { info: { type: 'anythingElse' } } as Ticker;
      expect(isFTXSpot(mockTicker)).toBeFalsy();
    });

    it('should throw error', () => {
      expect(() => isFTXSpot(undefined)).toThrowError(TypeError);
      expect(() => isFTXSpot(null)).toThrowError(TypeError);
      const mockTicker = {} as Ticker;
      expect(() => isFTXSpot(mockTicker)).toThrowError();
    });
  });
});

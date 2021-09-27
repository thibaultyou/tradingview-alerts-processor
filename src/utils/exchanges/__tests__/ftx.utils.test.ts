import { Ticker } from 'ccxt';
import { isFTXSpot } from '../ftx.utils';

describe('FTX utils', () => {
  describe('isFTXSpot', () => {
    it('should return true', () => {
      const mockTicker = {
        info: {
          type: 'spot'
        }
      } as Ticker;
      expect(isFTXSpot(mockTicker)).toBeTruthy();
    });

    it('should return false', () => {
      const mockTicker = {
        info: {
          type: 'anythingElse'
        }
      } as Ticker;
      expect(isFTXSpot(mockTicker)).toBeFalsy();
    });
  });
});

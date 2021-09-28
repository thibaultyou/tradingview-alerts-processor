import { getSpotQuote, getSpotSymbol } from '../symbol.utils';

describe('Symbol utils', () => {
  describe('getSpotSymbol', () => {
    it('should return symbol', () => {
      expect(getSpotSymbol('X/Y')).toEqual('X');
    });
  });

  describe('getSpotQuote', () => {
    it('should return quote', () => {
      expect(getSpotQuote('X/Y')).toEqual('Y');
    });
  });
});

import { ConversionError } from '../../../errors/exchange.errors';
import { OrderSizeError } from '../../../errors/trading.errors';
import { getRelativeOrderSize, getTokensAmount } from '../conversion.utils';

describe('Conversion utils', () => {
  describe('getRelativeOrderSize', () => {
    it('should return relative size', () => {
      expect(getRelativeOrderSize(70, '10%')).toEqual(7);
      expect(getRelativeOrderSize(70, '100%')).toEqual(70);

      // sad paths
      expect(getRelativeOrderSize(70, '%50')).toEqual(35);
      expect(getRelativeOrderSize(70, '%%4%0%%%')).toEqual(28);
      expect(getRelativeOrderSize(70, 'fifteen percent')).toEqual(NaN);
      expect(getRelativeOrderSize(70, 'NaN')).toEqual(NaN);
    });

    it('should throw if range is incorrect', () => {
      expect(() => getRelativeOrderSize(70, '0%')).toThrowError(OrderSizeError);
      expect(() => getRelativeOrderSize(70, '-0.001%')).toThrowError(
        OrderSizeError
      );
      expect(() => getRelativeOrderSize(70, '%')).toThrowError(OrderSizeError);

      // sad path
      expect(() => getRelativeOrderSize(70, null)).toThrowError(TypeError);
    });
  });

  describe('getTokensAmount', () => {
    it('should return tokens amount', () => {
      expect(getTokensAmount('symbol', 50, 20)).toEqual(0.4);
      expect(getTokensAmount('symbol', 50, 0)).toEqual(0);

      // sad paths
      expect(getTokensAmount('symbol', 50, -150)).toEqual(-3);
      expect(getTokensAmount('symbol', -50, 150)).toEqual(-3);
      expect(getTokensAmount('symbol', -50, -150)).toEqual(3);
      expect(getTokensAmount('symbol', 0, 0.01)).toEqual(Infinity);
      expect(getTokensAmount('symbol', null, -150)).toEqual(-Infinity);
      expect(getTokensAmount(null, 3, 45)).toEqual(15);
    });

    it('should throw on error', () => {
      expect(() => getTokensAmount(null, 2.8, null)).toThrowError(TypeError);
      expect(() => getTokensAmount(null, 50, NaN)).toThrowError(
        ConversionError
      );
      expect(() => getTokensAmount(null, NaN, null)).toThrowError(
        ConversionError
      );
      expect(() => getTokensAmount(null, NaN, Infinity)).toThrowError(
        ConversionError
      );
      expect(() => getTokensAmount(null, null, NaN)).toThrowError(
        ConversionError
      );
      expect(() => getTokensAmount(null, NaN, NaN)).toThrowError(
        ConversionError
      );
      expect(() => getTokensAmount(null, null, null)).toThrowError(
        ConversionError
      );
      expect(() => getTokensAmount(null, Infinity, Infinity)).toThrowError(
        ConversionError
      );
      expect(() => getTokensAmount(null, -Infinity, null)).toThrowError(
        TypeError
      );
    });
  });

  describe('getTokensPrice', () => {
    it.todo('should return tokens price');

    it.todo('should throw on error');
  });

  describe('getOrderCost', () => {
    it.todo('should return cost');
  });
});

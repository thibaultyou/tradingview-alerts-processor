import { mockRequest, mockResponse } from '../../tests/tests.utils';
import {
  consoleLoggerOptions,
  debugLogFileLoggerOptions,
  defaultLoggerFormat,
  errorLogFileLoggerOptions,
  loggingMiddleware,
  messageWrapper,
  tradesLogFileLoggerOptions
} from '../logger.utils';

describe('Logger utils', () => {
  describe('loggingMiddleware', () => {
    it('should call next function', () => {
      const next = jest.fn();
      loggingMiddleware(mockRequest(), mockResponse(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('defaultLoggerFormat', () => {
    it('should combine default logging formats', () => {
      expect(defaultLoggerFormat).toEqual(
        expect.objectContaining({
          Format: expect.any(Function),
          options: expect.any(Object)
        })
      );
    });
  });

  describe('consoleLoggerOptions', () => {
    it('should combine console logging formats', () => {
      expect(consoleLoggerOptions).toEqual(
        expect.objectContaining({
          format: expect.objectContaining({
            Format: expect.any(Function)
          })
        })
      );
    });

    it('should set console logging level', () => {
      expect(consoleLoggerOptions.level).toStrictEqual(
        expect.stringMatching(new RegExp(/^(info|debug)$/))
      );
    });

    it('should return console logger options', () => {
      expect(consoleLoggerOptions).toEqual(
        expect.objectContaining({
          format: expect.objectContaining({
            options: expect.any(Object)
          })
        })
      );
    });
  });

  describe('errorLogFileLoggerOptions', () => {
    it('should return error file logger options', () => {
      expect(errorLogFileLoggerOptions).toEqual(
        expect.objectContaining({
          level: 'error',
          filename: 'logs/error.log'
        })
      );
    });
  });

  describe('debugLogFileLoggerOptions', () => {
    it('should return debug file logger options', () => {
      expect(debugLogFileLoggerOptions).toEqual(
        expect.objectContaining({
          filename: 'logs/debug.log'
        })
      );
    });
  });

  describe('tradesLogFileLoggerOptions', () => {
    it('should return trades file logger options', () => {
      expect(tradesLogFileLoggerOptions).toEqual(
        expect.objectContaining({
          filename: 'logs/trades.log'
        })
      );
    });
  });

  describe('messageWrapper', () => {
    it('should wrap a message with a prefix', () => {
      expect(messageWrapper('prefix', 'message')).toStrictEqual(
        'prefix|message'
      );
    });
  });
});

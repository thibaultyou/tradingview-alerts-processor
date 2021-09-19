import { mockRequest, mockResponse } from '../../tests/tests.utils';
import { loggingMiddleware, messageWrapper } from '../logger.utils';

describe('Logger utils', () => {
  describe('loggingMiddleware', () => {
    it('should call next function', () => {
      const next = jest.fn();
      loggingMiddleware(mockRequest(), mockResponse(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('defaultLoggerFormat', () => {
    it.todo('should combine default logging formats');
  });

  describe('consoleLoggerOptions', () => {
    it.todo('should combine console logging formats');

    it.todo('should set console logging level');

    it.todo('should return console logger options');
  });

  describe('errorLogFileLoggerOptions', () => {
    it.todo('should return error file logger options');
  });

  describe('debugLogFileLoggerOptions', () => {
    it.todo('should return debug file logger options');
  });

  describe('tradesLogFileLoggerOptions', () => {
    it.todo('should return trades file logger options');
  });

  describe('messageWrapper', () => {
    it('should wrap a message with a prefix', () => {
      expect(messageWrapper('prefix', 'message')).toStrictEqual(
        'prefix|message'
      );
    });
  });
});

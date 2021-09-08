import { mockRequest, mockResponse } from '../tests/tests.utils';
import { loggingMiddleware, messageWrapper } from "./logger.utils";

describe('loggingMiddleware', () => {
  xit('should debug the requested route and request method', () => {
    const next = jest.fn().mockReturnValue(undefined);
    loggingMiddleware(mockRequest(), mockResponse(), next);
    
  });
  it('should call the next function', () => {
    const next = jest.fn().mockReturnValue(undefined);
    loggingMiddleware(mockRequest(), mockResponse(), next);
    expect(next).toHaveBeenCalled();
  });
});

describe('messageWrapper', () => {
  it('should wrap a message with a prefix', () => {
    expect(messageWrapper('aPrefix', 'aMessage')).toStrictEqual('aPrefix|aMessage');
  });
});
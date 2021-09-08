import { errorMiddleware } from './errors.utils';
import { Request, Response } from 'express';

const mockError = () => {
  const err = {} as Error;
  err.stack = jest.fn().mockReturnValue('stack') as unknown as string;
  return err;
};

const mockRequest = () => {
  return {} as Request;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('errorMiddleware', () => {
  it('should send an error response', () => {
    const err = mockError();
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn().mockReturnValue(undefined);
    errorMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Something unexpected happened...');
    expect(next).toHaveBeenCalled();
  });
});

import { removeAccount } from '../services/account.service';
import { sampleAccount, sampleSubaccount } from './fixtures/common.fixtures';
import { Request, Response } from 'express';

export const clearTestingDatabase = (): void => {
  try {
    removeAccount(sampleAccount.stub);
  } catch (err) {
    // ignore
  }
  try {
    removeAccount(sampleSubaccount.stub);
  } catch (err) {
    // ignore
  }
};

export const mockError = () => {
  const err = {} as Error;
  err.stack = jest.fn().mockReturnValue('stack') as unknown as string;
  return err;
};

export const mockRequest = () => {
  return {} as Request;
};

export const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};
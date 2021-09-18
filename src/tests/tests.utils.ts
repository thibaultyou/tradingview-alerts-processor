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

export const mockError = (mock?: Record<string, any>): Error => {
  const err = {
    stack: 'stack',
    ...mock
  } as Error;
  return err;
};

export const mockRequest = (mock?: Record<string, any>): Request => {
  return { ...mock } as Request;
};

export const mockResponse = (mock?: Record<string, any>): Response => {
  const res = { ...mock } as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

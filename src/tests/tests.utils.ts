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

export const mockError = (): Error => {
  const err = {
    stack: 'stack'
  } as Error;
  return err;
};

export const mockRequest = (): Request => {
  return {} as Request;
};

export const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

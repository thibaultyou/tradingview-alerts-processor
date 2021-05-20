import { Request, Response } from 'express';
import { IAccount, IAccountStub } from '../interfaces/account.interface';
import {
  readAccount,
  addAccount,
  removeAccount
} from '../models/account.model';

export const postAccount = (req: Request, res: Response): void => {
  const { apiKey, exchange, secret, stub, subaccount }: IAccount = req.body;
  const result = addAccount({
    apiKey: apiKey,
    exchange: exchange,
    secret: secret,
    stub: stub,
    subaccount: subaccount
  });
  res.write(
    result
      ? JSON.stringify({
          message: `"${stub}" account successfully registered.`
        })
      : JSON.stringify({ message: `"${stub}" account already exists.` })
  );
  res.end();
};

export const getAccount = (req: Request, res: Response): void => {
  const { stub }: IAccountStub = req.body;
  const result = readAccount(stub);
  res.write(
    result
      ? JSON.stringify(result)
      : JSON.stringify({ message: `"${stub}" account does not exists.` })
  );
  res.end();
};

export const deleteAccount = (req: Request, res: Response): void => {
  const { stub }: IAccountStub = req.body;
  const result = removeAccount(stub);
  res.write(
    result
      ? JSON.stringify({ message: `"${stub}" account successfully removed.` })
      : JSON.stringify({ message: `"${stub}" account does not exists.` })
  );
  res.end();
};

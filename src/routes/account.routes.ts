import { Request, Response } from 'express';
import { Account, AccountStub } from '../entities/account.entities';
import {
  readAccount,
  addAccount,
  removeAccount
} from '../models/account.model';

export const postAccount = (req: Request, res: Response): void => {
  const { apiKey, exchange, secret, stub, subaccount }: Account = req.body;
  const id = subaccount ? subaccount : stub;
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
          message: `"${id}" account successfully registered.`
        })
      : JSON.stringify({
          message: `"${id}" account already exists.`
        })
  );
  res.end();
};

export const getAccount = (req: Request, res: Response): void => {
  const { stub }: AccountStub = req.body;
  const result = readAccount(stub);
  res.write(
    result
      ? JSON.stringify(result)
      : JSON.stringify({ message: `"${stub}" account does not exists.` })
  );
  res.end();
};

export const deleteAccount = (req: Request, res: Response): void => {
  const { stub }: AccountStub = req.body;
  const result = removeAccount(stub);
  res.write(
    result
      ? JSON.stringify({ message: `"${stub}" account successfully removed.` })
      : JSON.stringify({ message: `"${stub}" account does not exists.` })
  );
  res.end();
};

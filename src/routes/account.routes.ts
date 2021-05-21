import { Request, Response } from 'express';
import { Account, AccountStub } from '../entities/account.entities';
import {
  readAccount,
  addAccount,
  removeAccount
} from '../services/account.service';
import { getAccountId } from '../utils/account.utils';

export const postAccount = (req: Request, res: Response): void => {
  const account: Account = req.body;
  const { apiKey, exchange, secret, stub, subaccount } = account;
  const accountId = getAccountId(account);
  const result = addAccount({
    apiKey: apiKey,
    exchange: exchange,
    secret: secret,
    stub: stub.toUpperCase(),
    subaccount: subaccount.toUpperCase()
  });
  res.write(
    result
      ? JSON.stringify({
          message: `"${accountId}" account successfully registered.`
        })
      : JSON.stringify({
          message: `"${accountId}" account already exists.`
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

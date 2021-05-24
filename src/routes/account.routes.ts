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
  const entry: Account = {
    apiKey: apiKey,
    exchange: exchange,
    secret: secret,
    stub: stub.toUpperCase()
  };
  if (subaccount) {
    entry['subaccount'] = subaccount.toUpperCase();
  }
  const result = addAccount(entry);
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
  try {
    res.write(JSON.stringify(readAccount(stub.toUpperCase())));
  } catch (err) {
    res.writeHead(404);
    res.write(
      JSON.stringify({ message: `"${stub}" account does not exists.` })
    );
  }
  res.end();
};

export const deleteAccount = (req: Request, res: Response): void => {
  const { stub }: AccountStub = req.body;
  try {
    removeAccount(stub.toUpperCase());
    res.write(
      JSON.stringify({ message: `"${stub}" account successfully removed.` })
    );
  } catch (err) {
    res.writeHead(404);
    res.write(
      JSON.stringify({ message: `"${stub}" account does not exists.` })
    );
  }
  res.end();
};

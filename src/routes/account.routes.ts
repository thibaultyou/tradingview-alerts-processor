import { Request, Response } from 'express';
import {
  ACCOUNT_DELETE_ERROR,
  ACCOUNT_DELETE_SUCCESS,
  ACCOUNT_READ_ERROR,
  ACCOUNT_READ_SUCCESS,
  ACCOUNT_WRITE_ERROR,
  ACCOUNT_WRITE_SUCCESS
} from '../messages/account.messages';
import {
  formatAccount,
  formatAccountStub,
  getAccountId
} from '../utils/account.utils';
import {
  writeAccount,
  readAccount,
  removeAccount
} from '../services/account.service';
import { HttpCode } from '../constants/http.constants';

export const postAccount = (req: Request, res: Response): void => {
  const account = formatAccount(req.body);
  const id = getAccountId(account);
  try {
    writeAccount(account);
    res.write(
      JSON.stringify({
        message: ACCOUNT_WRITE_SUCCESS(id)
      })
    );
  } catch (err) {
    res.writeHead(HttpCode.BAD_REQUEST);
    res.write(
      JSON.stringify({
        message: ACCOUNT_WRITE_ERROR(id)
      })
    );
  }
  res.end();
};

export const getAccount = (req: Request, res: Response): void => {
  const id = formatAccountStub(req.body);
  try {
    const account = readAccount(id);
    res.write(
      JSON.stringify({
        message: ACCOUNT_READ_SUCCESS(id),
        account: account
      })
    );
  } catch (err) {
    res.writeHead(HttpCode.NOT_FOUND);
    res.write(JSON.stringify({ message: ACCOUNT_READ_ERROR(id) }));
  }
  res.end();
};

export const deleteAccount = (req: Request, res: Response): void => {
  const id = formatAccountStub(req.body);
  try {
    removeAccount(id);
    res.write(JSON.stringify({ message: ACCOUNT_DELETE_SUCCESS(id) }));
  } catch (err) {
    res.writeHead(HttpCode.NOT_FOUND);
    res.write(JSON.stringify({ message: ACCOUNT_DELETE_ERROR(id) }));
  }
  res.end();
};

import { Request, Response, Router } from 'express';
import {
  ACCOUNT_DELETE_SUCCESS,
  ACCOUNT_READ_SUCCESS,
  ACCOUNT_WRITE_SUCCESS
} from '../messages/account.messages';
import { formatAccount, formatAccountStub } from '../utils/account.utils';
import {
  writeAccount,
  readAccount,
  removeAccount
} from '../services/account.service';
import { HttpCode } from '../constants/http.constants';
import { ACCOUNTS_ROUTE } from '../constants/routes.constants';
import { loggingMiddleware } from '../utils/logger.utils';
import {
  validateAccount,
  validateAccountStub
} from '../validators/account.validators';

const router = Router();

export const postAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const account = formatAccount(req.body);
  const id = account.stub.toUpperCase();
  try {
    await writeAccount(account);
    res.write(
      JSON.stringify({
        message: ACCOUNT_WRITE_SUCCESS(id)
      })
    );
  } catch (err) {
    res.writeHead(HttpCode.BAD_REQUEST);
    res.write(
      JSON.stringify({
        message: err.message
      })
    );
  }
  res.end();
};

export const getAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = formatAccountStub(req.body);
  try {
    const account = await readAccount(id);
    res.write(
      JSON.stringify({
        message: ACCOUNT_READ_SUCCESS(id),
        account: account
      })
    );
  } catch (err) {
    res.writeHead(HttpCode.NOT_FOUND);
    res.write(JSON.stringify({ message: err.message }));
  }
  res.end();
};

export const deleteAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = formatAccountStub(req.body);
  try {
    await removeAccount(id);
    res.write(JSON.stringify({ message: ACCOUNT_DELETE_SUCCESS(id) }));
  } catch (err) {
    res.writeHead(HttpCode.NOT_FOUND);
    res.write(JSON.stringify({ message: err.message }));
  }
  res.end();
};

export const accountRouter = router
  .post(ACCOUNTS_ROUTE, loggingMiddleware, validateAccount, postAccount)
  .get(ACCOUNTS_ROUTE, loggingMiddleware, validateAccountStub, getAccount) // TODO replace with a list of account
  .delete(
    ACCOUNTS_ROUTE,
    loggingMiddleware,
    validateAccountStub,
    deleteAccount
  );

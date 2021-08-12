import { Request, Response, Router } from 'express';
import {
  ACCOUNTS_READ_SUCCESS,
  ACCOUNT_DELETE_SUCCESS,
  ACCOUNT_READ_SUCCESS,
  ACCOUNT_WRITE_SUCCESS
} from '../messages/account.messages';
import {
  formatAccount,
  getAccountId,
  hideAccountSensitiveData
} from '../utils/account.utils';
import {
  writeAccount,
  readAccount,
  readAccounts,
  removeAccount
} from '../services/account.service';
import { HttpCode } from '../constants/http.constants';
import { loggingMiddleware } from '../utils/logger.utils';
import {
  validateAccount,
  validateAccountId
} from '../validators/account.validators';
import { Route } from '../constants/routes.constants';
import { Account } from '../entities/account.entities';

const router = Router();

export const postAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const account = formatAccount(req.body);
  const id = getAccountId(account);
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
  const id = req.params.id;
  try {
    const account = await readAccount(id);
    res.write(
      JSON.stringify({
        message: ACCOUNT_READ_SUCCESS(id),
        account: hideAccountSensitiveData(account)
      })
    );
  } catch (err) {
    res.writeHead(HttpCode.NOT_FOUND);
    res.write(JSON.stringify({ message: err.message }));
  }
  res.end();
};

export const getAccounts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const accounts: Account[] = await readAccounts();
    res.write(
      JSON.stringify({
        message: ACCOUNTS_READ_SUCCESS(),
        accounts: accounts.map((a) => hideAccountSensitiveData(a))
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
  const id = req.params.id;
  try {
    await removeAccount(id);
    res.write(JSON.stringify({ message: ACCOUNT_DELETE_SUCCESS(id) }));
  } catch (err) {
    res.writeHead(HttpCode.NOT_FOUND);
    res.write(JSON.stringify({ message: err.message }));
  }
  res.end();
};

export const accountsRouter = router
  .post(Route.Accounts, loggingMiddleware, validateAccount, postAccount)
  .get(Route.Accounts, loggingMiddleware, getAccounts)
  .get(
    `${Route.Accounts}/:id`,
    loggingMiddleware,
    validateAccountId,
    getAccount
  )
  .delete(
    `${Route.Accounts}/:id`,
    loggingMiddleware,
    validateAccountId,
    deleteAccount
  );

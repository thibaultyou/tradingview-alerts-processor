import { Request, Response, Router } from 'express';
import { readAccount, readAccounts } from '../services/account.service';
import { HttpCode } from '../constants/http.constants';
import { TradingService } from '../services/trading/trading.service';
import {
  ALL_BALANCES_READ_SUCCESS,
  BALANCES_READ_SUCCESS
} from '../messages/exchanges.messages';
import { Route } from '../constants/routes.constants';
import { loggingMiddleware } from '../utils/logger.utils';
import { validateAccountId } from '../validators/account.validators';

const router = Router();

export const getAccountBalances = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;
  try {
    const account = await readAccount(id);
    const { exchange } = account;
    const balances = await TradingService.getTradeExecutor(exchange)
      .getExchangeService()
      .getBalances(account);
    res.write(
      JSON.stringify({
        message: BALANCES_READ_SUCCESS(exchange, id),
        balances: balances
      })
    );
  } catch (err) {
    res.writeHead(HttpCode.INTERNAL_SERVER_ERROR);
    res.write(
      JSON.stringify({
        message: err.message
      })
    );
  }
  res.end();
};

export const getAccountsBalances = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const accounts = await readAccounts();
    const accountsBalances = [];
    for (const account of accounts) {
      try {
        accountsBalances.push({
          account: account.stub,
          balances: await (
            await TradingService.getTradeExecutor(account.exchange)
          )
            .getExchangeService()
            .getBalances(account)
        });
      } catch (err) {
        // silent
      }
    }
    res.write(
      JSON.stringify({
        message: ALL_BALANCES_READ_SUCCESS(),
        balances: accountsBalances
      })
    );
  } catch (err) {
    res.writeHead(HttpCode.INTERNAL_SERVER_ERROR);
    res.write(
      JSON.stringify({
        message: err.message
      })
    );
  }
  res.end();
};

export const balancesRouter = router
  .get(
    `${Route.Balances}/:id`,
    loggingMiddleware,
    validateAccountId,
    getAccountBalances
  )
  .get(`${Route.Balances}`, loggingMiddleware, getAccountsBalances);

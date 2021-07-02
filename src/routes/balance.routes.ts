import { Request, Response, Router } from 'express';
import { readAccount } from '../services/account.service';
import { AccountStub } from '../entities/account.entities';
import { HttpCode } from '../constants/http.constants';
import { TradingService } from '../services/trading/trading.service';
import { BALANCES_READ_SUCCESS } from '../messages/exchanges.messages';
import { Route } from '../constants/routes.constants';
import { loggingMiddleware } from '../utils/logger.utils';
import { validateAccountStub } from '../validators/account.validators';

const router = Router();

export const getBalances = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { stub }: AccountStub = req.body;
  try {
    const account = await readAccount(stub);
    const { exchange } = account;
    const balances = await TradingService.getTradeExecutor(exchange)
      .getExchangeService()
      .getBalances(account);
    res.write(
      JSON.stringify({
        message: BALANCES_READ_SUCCESS(exchange, stub),
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

export const balancesRouter = router.get(
  Route.Balances,
  loggingMiddleware,
  validateAccountStub,
  getBalances
);

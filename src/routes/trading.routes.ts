import { Request, Response, Router } from 'express';
import { readAccount } from '../services/account.service';
import { Trade } from '../entities/trade.entities';
import { getTradeSide } from '../utils/trading.utils';
import { HttpCode } from '../constants/http.constants';
import { TRADE_EXECUTION_SUCCESS } from '../messages/trading.messages';
import { TradingService } from '../services/trading/trading.service';
import { Route } from '../constants/routes.constants';
import { loggingMiddleware } from '../utils/logger.utils';
import { validateTrade } from '../validators/trade.validators';

const router = Router();

export const postTrade = async (req: Request, res: Response): Promise<void> => {
  const { direction, stub, symbol }: Trade = req.body;
  const side = getTradeSide(direction);
  try {
    const account = await readAccount(stub);
    TradingService.getTradeExecutor(account.exchange).addTrade(
      account,
      req.body
    );
    res.write(
      JSON.stringify({
        message: TRADE_EXECUTION_SUCCESS(account.exchange, stub, symbol, side)
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

export const tradingRouter = router.post(
  Route.Trading,
  loggingMiddleware,
  validateTrade,
  postTrade
);

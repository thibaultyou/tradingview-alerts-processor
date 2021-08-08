import { Request, Response, Router } from 'express';
import { readAccount } from '../services/account.service';
import { Trade } from '../entities/trade.entities';
import { HttpCode } from '../constants/http.constants';
import {
  TRADES_EXECUTION_SUCCESS,
  TRADE_EXECUTION_SUCCESS
} from '../messages/trading.messages';
import { TradingService } from '../services/trading/trading.service';
import { Route } from '../constants/routes.constants';
import { loggingMiddleware } from '../utils/logger.utils';
import { validateTrade } from '../validators/trade.validators';
import { getSide } from '../utils/trading/side.utils';

const router = Router();

// TODO refacto
export const postTrade = async (req: Request, res: Response): Promise<void> => {
  try {
    if (Array.isArray(req.body)) {
      const trades: Record<string, string>[] = [];
      const errors = [];
      for (const trade of req.body) {
        const { direction, stub, symbol }: Trade = trade;
        const side = getSide(direction);
        try {
          const account = await readAccount(stub);
          TradingService.getTradeExecutor(account.exchange).addTrade(
            account,
            trade
          );
          trades.push({
            exchange: account.exchange,
            account: stub,
            symbol: symbol,
            side: side
          });
        } catch (err) {
          errors.push(err.message)
        }
      }
      res.write(
        JSON.stringify({
          message: TRADES_EXECUTION_SUCCESS,
          trades,
          errors
        })
      );
    } else {
      const { direction, stub, symbol }: Trade = req.body;
      const side = getSide(direction);
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
    }
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

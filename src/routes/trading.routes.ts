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
import { DatabaseService } from '../services/db/db.service';
import { Account } from '../entities/account.entities';

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
          const promises: Promise<unknown>[] = [];
          promises.push(checkForDuplicate(trade));
          promises.push(readAccount(stub));
          await Promise.all(promises).then(
            ([isDuplicate, account]: [boolean, Account]) => {
              if (!isDuplicate) {
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
              } else {
                res.write(
                  JSON.stringify({
                    message: 'Duplicate trade'
                  })
                );
              }
            }
          );
        } catch (err) {
          errors.push(err.message);
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
      const promises: Promise<unknown>[] = [];
      promises.push(checkForDuplicate(req.body));
      promises.push(readAccount(stub));
      await Promise.all(promises.map((p) => p.catch((e) => e))).then(
        ([isDuplicate, account]: [boolean, Account]) => {
          if (!isDuplicate) {
            TradingService.getTradeExecutor(account.exchange).addTrade(
              account,
              req.body
            );
            res.write(
              JSON.stringify({
                message: TRADE_EXECUTION_SUCCESS(
                  account.exchange,
                  stub,
                  symbol,
                  side
                )
              })
            );
          } else {
            res.write(
              JSON.stringify({
                message: 'Duplicate trade'
              })
            );
          }
        }
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

async function checkForDuplicate(trade: any): Promise<boolean> {
  const db = DatabaseService.getDatabaseInstance();
  const { stub, symbol, TCycles, TBuys } = trade;
  let existingEntry;
  try {
    existingEntry = await db.read(
      `${stub}/orders/${symbol}/${TCycles}/${TBuys}`
    ); // TODO: ensure chart is distinct, too
  } catch (error) {
    // specify error type
    existingEntry = null;
  }
  if (!existingEntry) {
    // if no previous total buys
    try {
      // await // TODO: Consider whether worth awaiting the result (at cost of delayed trade execution)
      db.create(
        `${stub}/orders/${symbol}/${TCycles}/${TBuys}`,
        trade.direction
      );
    } catch (error) {
      console.log(error);
    }
    return false;
  } else {
    console.log('Duplicate trade');
    return true;
  }
  // TODO: clear ones from a 2+ cycles back
}

export const tradingRouter = router.post(
  Route.Trading,
  loggingMiddleware,
  validateTrade,
  postTrade
);

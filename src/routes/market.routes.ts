import { Request, Response, Router } from 'express';

import { HttpCode } from '../constants/http.constants';
import { Route } from '../constants/routes.constants';
import { validateMarket } from '../validators/market.validators';
import { loggingMiddleware } from '../utils/logger.utils';
import { MARKETS_READ_SUCCESS } from '../messages/exchanges.messages';
import { TradingService } from '../services/trading/trading.service';
import { ExchangeId } from '../constants/exchanges.constants';

const router = Router();

export const getMarkets = async (
  req: Request,
  res: Response
): Promise<void> => {
  const exchange = req.params.exchange as ExchangeId;
  try {
    const markets = await TradingService.getTradeExecutor(exchange)
      .getExchangeService()
      .getMarkets();
    res.write(
      JSON.stringify({
        message: MARKETS_READ_SUCCESS(exchange),
        markets: markets
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

export const marketsRouter = router.get(
  `${Route.Markets}/:exchange`,
  loggingMiddleware,
  validateMarket,
  getMarkets
);

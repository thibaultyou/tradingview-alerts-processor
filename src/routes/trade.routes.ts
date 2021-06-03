import { Request, Response } from 'express';
import { refreshExchange } from '../services/exchange.service';
import { readAccount } from '../services/account.service';
import { Trade } from '../entities/trade.entities';
import { getTradeSide } from '../utils/trade.utils';
import { HttpCode } from '../constants/http.constants';
import { TRADE_EXECUTION_SUCCESS } from '../messages/trade.messages';
import { TradingService } from '../services/trade.service';

export const postTrade = async (req: Request, res: Response): Promise<void> => {
  const { direction, stub, symbol }: Trade = req.body;
  const side = getTradeSide(direction);
  try {
    const account = readAccount(stub);
    const exchange = await refreshExchange(account);
    TradingService.getInstance(account.exchange).addTrade(
      exchange,
      account,
      req.body
    );
    res.write(
      JSON.stringify({
        message: TRADE_EXECUTION_SUCCESS(stub, symbol, side)
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

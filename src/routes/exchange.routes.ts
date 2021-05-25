import { Request, Response } from 'express';
import {
  executeTrade,
  fetchAvailableMarkets,
  getAccountBalances
} from '../services/exchange.service';
import { readAccount } from '../services/account.service';
import { AccountStub } from '../entities/account.entities';
import { Trade } from '../entities/trade.entities';
import { getTradeSide } from '../utils/trade.utils';
import { Market } from '../entities/market.entities';
import { HttpCode } from '../constants/http.constants';
import {
  BALANCE_READ_ERROR,
  BALANCE_READ_SUCCESS,
  MARKETS_READ_ERROR,
  MARKETS_READ_SUCCESS
} from '../messages/exchange.messages';
import {
  TRADE_EXECUTION_ERROR,
  TRADE_EXECUTION_SUCCESS
} from '../messages/trade.messages';

export const getBalances = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { stub }: AccountStub = req.body;
  try {
    const account = readAccount(stub);
    const balances = await getAccountBalances(account);
    res.write(
      JSON.stringify({
        message: BALANCE_READ_SUCCESS(stub),
        balances: balances
      })
    );
  } catch (err) {
    res.writeHead(HttpCode.INTERNAL_SERVER_ERROR);
    res.write(
      JSON.stringify({
        message: BALANCE_READ_ERROR(stub),
        error: err.message
      })
    );
  }
  res.end();
};

export const postTrade = async (req: Request, res: Response): Promise<void> => {
  const { direction, stub, symbol }: Trade = req.body;
  const side = getTradeSide(direction);
  try {
    const account = readAccount(stub);
    executeTrade(account, req.body);
    res.write(
      JSON.stringify({
        message: TRADE_EXECUTION_SUCCESS(stub, symbol, side)
      })
    );
  } catch (err) {
    res.writeHead(HttpCode.INTERNAL_SERVER_ERROR);
    res.write(
      JSON.stringify({
        message: TRADE_EXECUTION_ERROR(stub, symbol, side),
        error: err.message
      })
    );
  }
  res.end();
};

export const getMarkets = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { exchange }: Market = req.body;
  try {
    const markets = await fetchAvailableMarkets(req.body);
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
        message: MARKETS_READ_ERROR(exchange),
        error: err.message
      })
    );
  }
  res.end();
};

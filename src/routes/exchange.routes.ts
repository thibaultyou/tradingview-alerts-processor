import { Request, Response } from 'express';
import {
  fetchAvailableMarkets,
  refreshExchange
} from '../services/exchange.service';
import { getAccountBalances, readAccount } from '../services/account.service';
import { AccountStub } from '../entities/account.entities';
import { Market } from '../entities/market.entities';
import { HttpCode } from '../constants/http.constants';
import {
  BALANCE_READ_SUCCESS,
  MARKETS_READ_SUCCESS
} from '../messages/exchange.messages';

export const getBalances = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { stub }: AccountStub = req.body;
  try {
    const account = readAccount(stub);
    const exchange = await refreshExchange(account);
    const balances = await getAccountBalances(exchange, account);
    res.write(
      JSON.stringify({
        message: BALANCE_READ_SUCCESS(account.exchange, stub),
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
        message: err.message
      })
    );
  }
  res.end();
};

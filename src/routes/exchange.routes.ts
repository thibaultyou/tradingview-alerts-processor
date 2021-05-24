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
import { IMarket } from '../interfaces/market.interface';

export const getBalances = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { stub }: AccountStub = req.body;
  try {
    const account = readAccount(stub);
    const balances = await getAccountBalances(account);
    res.write(JSON.stringify({ balances: balances.info.result }));
  } catch (err) {
    res.writeHead(500);
    res.write(
      JSON.stringify({
        message: `Unable to fetch balances for "${stub}" account.`,
        error: err.message
      })
    );
  }
  res.end();
};

export const postTrade = async (req: Request, res: Response): Promise<void> => {
  const { direction, stub, symbol }: Trade = req.body;
  const side = getTradeSide(direction);
  let account;
  try {
    account = readAccount(stub);
    executeTrade(account, req.body);
    res.write(
      JSON.stringify({
        message: `${symbol} ${side} trade executed for "${stub}" account.`
      })
    );
  } catch (err) {
    res.writeHead(500);
    res.write(
      JSON.stringify({
        message: `Unable to execute ${symbol} ${side} trade for "${stub}" account.`,
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
    const markets: IMarket[] = await fetchAvailableMarkets(req.body);
    res.write(JSON.stringify({ markets: markets }));
  } catch (err) {
    res.writeHead(500);
    res.write(
      JSON.stringify({
        message: `Unable to fetch "${exchange.toUpperCase()}" markets.`,
        error: err.message
      })
    );
  }
  res.end();
};

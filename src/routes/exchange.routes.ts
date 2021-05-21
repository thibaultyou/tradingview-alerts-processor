import { Request, Response } from 'express';
import { executeTrade, getAccountBalances } from '../services/exchange.service';
import { readAccount } from '../services/account.service';
import { AccountStub } from '../entities/account.entities';
import { Trade } from '../entities/trade.entities';
import { getTradeSide } from '../utils/trade.utils';

export const getBalances = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { stub }: AccountStub = req.body;
  const account = readAccount(stub);
  const balances = await getAccountBalances(account);
  if (!account) {
    res.writeHead(404);
    res.write(
      JSON.stringify({ message: `"${stub}" account does not exists.` })
    );
    res.end();
  } else if (!balances) {
    res.writeHead(500);
    res.write(
      JSON.stringify({
        message: `Unable to fetch balances for "${stub}" account.`
      })
    );
    res.end();
  } else {
    res.write(JSON.stringify({ balances: balances.info.result }));
    res.end();
  }
};

export const postTrade = async (req: Request, res: Response): Promise<void> => {
  const { direction, stub, symbol }: Trade = req.body;
  const side = getTradeSide(direction);
  const account = readAccount(stub);
  const success = await executeTrade(account, req.body);
  if (!account) {
    res.writeHead(404);
    res.write(
      JSON.stringify({ message: `"${stub}" account does not exists.` })
    );
    res.end();
  } else if (!success) {
    res.writeHead(500);
    res.write(
      JSON.stringify({
        message: `Unable to execute ${symbol} ${side} trade for "${stub}" account.`
      })
    );
    res.end();
  } else {
    res.write(
      JSON.stringify({
        message: `${symbol} ${side} trade executed for "${stub}" account.`
      })
    );
    res.end();
  }
};

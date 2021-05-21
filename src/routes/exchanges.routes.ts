import { Request, Response } from 'express';
import {
  executeTrade,
  getAccountBalances
} from '../services/exchanges.service';
import { readAccount } from '../models/account.model';
import { Account, AccountStub } from '../entities/account.entities';
import { Trade } from '../entities/trade.entities';
import { getTradeSide } from '../utils/trade.utils';

const accounts = new Map<string, Account>();

export const getAccount = async (
  req: Request,
  res: Response
): Promise<Account> => {
  const { stub, subaccount }: Account = req.body;
  const id = subaccount ? subaccount : stub;
  const account = accounts.get(id);
  if (!account) {
    const result = readAccount(id);
    if (!result) {
      res.writeHead(404);
      res.write({
        message: JSON.stringify({
          message: `"${stub}" account does not exists.`
        })
      });
      res.end();
    } else {
      accounts.set(id, result);
    }
  }
  return accounts.get(id);
};

export const getBalances = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { stub }: AccountStub = req.body;
  const account = await getAccount(req, res);
  const balances = await getAccountBalances(account);
  if (!balances) {
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
  const account = await getAccount(req, res);
  const order = await executeTrade(account, req.body);
  if (!order) {
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
        message: `${symbol} ${side} trade successfully executed for "${stub}" account.`,
        order: order
      })
    );
    res.end();
  }
};

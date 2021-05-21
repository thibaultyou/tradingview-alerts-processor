import { Order, Ticker, Exchange } from 'ccxt';
import ccxt = require('ccxt');
import { Account } from '../entities/account.entities';
import { Trade } from '../entities/trade.entities';
import { IBalances } from '../interfaces/exchange.interfaces';
import { getAccountId } from '../utils/account.utils';
import { TradingService } from './trade.service';

const exchanges = new Map<string, Exchange>();
const tradingService = TradingService.getInstance();

export const refreshExchange = (account: Account): Exchange => {
  const { exchange, subaccount, apiKey, secret } = account;
  const accountId = getAccountId(account);
  if (!exchanges.has(accountId)) {
    if (exchange === 'ftx') {
      const options = { apiKey: apiKey, secret: secret };
      if (subaccount) {
        options['headers'] = { 'FTX-SUBACCOUNT': subaccount.toUpperCase() };
      }
      exchanges.set(accountId, new ccxt.ftx(options));
      console.info(
        `${exchange.toUpperCase()} instance for "${accountId}" loaded.`
      );
    }
  }
  return exchanges.get(accountId);
};

export const getAccountBalances = async (
  account: Account
): Promise<IBalances> => {
  const accountId = getAccountId(account);
  try {
    const balances: IBalances = await refreshExchange(account).fetch_balance();
    console.info(`"${accountId}" account balance successfully fetched.`);
    return balances;
  } catch (err) {
    throw new Error(`Failed to check "${accountId}" account balance : ${err}.`);
  }
};

export const fetchTickerPrice = async (
  account: Account,
  symbol: string
): Promise<Ticker> => {
  try {
    const ticker: Ticker = await refreshExchange(account).fetchTicker(symbol);
    console.info(`${symbol} ticker successfully fetched.`);
    return ticker;
  } catch (err) {
    throw new Error(`Failed to check "${symbol}" ticker : ${err}.`);
  }
};

export const executeTrade = (account: Account, trade: Trade): boolean => {
  const exchange = refreshExchange(account);
  tradingService.addTrade({ exchange, account, trade });
  return true;
};

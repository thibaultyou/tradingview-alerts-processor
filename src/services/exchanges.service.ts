import { Order, Ticker } from 'ccxt';
import ccxt = require('ccxt');
import { Account } from '../entities/account.entities';
import { Trade } from '../entities/trade.entities';
import { IBalances, IPosition } from '../interfaces/exchanges.interfaces';
import { getAccountId } from '../utils/account.utils';
import {
  getTradeSide,
  getInvertedTradeSide,
  getAverageTradeSize
} from '../utils/trade.utils';

const exchanges = new Map();

export const refreshExchange = (account: Account): void => {
  const { exchange, subaccount, stub, apiKey, secret } = account;
  const id = subaccount ? subaccount : stub;
  if (!exchanges.has(id)) {
    if (exchange === 'ftx') {
      const options = { apiKey: apiKey, secret: secret };
      if (subaccount) {
        options['headers'] = { 'FTX-SUBACCOUNT': subaccount.toUpperCase() };
      }
      exchanges.set(id, new ccxt.ftx(options));
      console.info(`${exchange} instance for "${id}" loaded.`);
    }
  } else {
    console.info(`${exchange} instance for "${id}" already loaded.`);
  }
};

export const getAccountBalances = async (
  account: Account
): Promise<IBalances> => {
  refreshExchange(account);
  const { subaccount, stub } = account;
  const id = subaccount ? subaccount : stub;
  const balances: IBalances = await exchanges.get(id).fetch_balance();
  console.info(`"${id}" account balance successfully fetched.`);
  return balances;
};

export const fetchTickerPrice = async (
  account: Account,
  symbol: string
): Promise<Ticker> => {
  refreshExchange(account);
  const { subaccount, stub } = account;
  const id = subaccount ? subaccount : stub;
  try {
    const ticker: Ticker = await exchanges.get(id).fetchTicker(symbol);
    return ticker;
  } catch (err) {
    throw new Error(`Failed to check "${symbol}" ticker : ${err}.`);
  }
};

const closeTrade = async (account: Account, trade: Trade): Promise<Order> => {
  const { symbol } = trade;
  const accountId = getAccountId(account);
  try {
    const positions: IPosition[] = await exchanges
      .get(accountId)
      .fetchPositions();
    const position = positions.filter((p) => p.future === symbol).pop();
    const { side, size } = position;
    if (!position || size === '0.0') {
      console.error(`No position found for ${symbol}.`);
      return;
    }
    const order: Order = await exchanges
      .get(accountId)
      .createMarketOrder(symbol, getInvertedTradeSide(side), size);
    console.error(
      `Closing trade for "${accountId}" account : ${position.cost}$US ${symbol}.`
    );
    return order;
  } catch (err) {
    throw new Error(`Failed to cancel ${symbol} trade : ${err}`);
  }
};

const openTrade = async (account: Account, trade: Trade): Promise<Order> => {
  const { direction, size, symbol } = trade;
  const accountId = getAccountId(account);
  const side = getTradeSide(direction);
  try {
    const ticker = await fetchTickerPrice(account, symbol);
    const tradeSize = getAverageTradeSize(ticker, size);
    const order: Order = await exchanges
      .get(accountId)
      .createMarketOrder(symbol, side, tradeSize);
    return order;
  } catch (err) {
    throw new Error(`Failed to execute ${symbol} ${side} trade : ${err}.`);
  }
};

export const executeTrade = async (
  account: Account,
  trade: Trade
): Promise<Order> => {
  refreshExchange(account);
  const { direction } = trade;
  return direction === 'cancel'
    ? await closeTrade(account, trade)
    : await openTrade(account, trade);
};

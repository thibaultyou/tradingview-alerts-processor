import { Ticker } from 'ccxt';
import ccxt = require('ccxt');
import { Account } from '../entities/account.entities';
import { getAccountId } from '../utils/account.utils';
import { debug, error } from './logger.service';
import { Market } from '../entities/market.entities';
import { IMarket } from '../interfaces/market.interface';
import {
  Exchange,
  FTX_SUBACCOUNT_HEADER
} from '../constants/exchanges.constants';
import {
  EXCHANGE_INIT_ERROR,
  EXCHANGE_INIT_SUCCESS,
  MARKETS_READ_ERROR,
  MARKETS_READ_SUCCESS,
  TICKER_READ_ERROR,
  TICKER_READ_SUCCESS
} from '../messages/exchange.messages';
import {
  ExchangeInstanceInitError,
  MarketsFetchError,
  TickerFetchError
} from '../errors/exchange.errors';
import { checkAccountCredentials } from './account.service';

const exchanges = new Map<string, ccxt.Exchange>();
const tickers = new Map<string, Map<string, ccxt.Ticker>>();

export const getExchange = async (account: Account): Promise<ccxt.Exchange> => {
  const { exchange, subaccount, apiKey, secret } = account;
  const options: ccxt.Exchange['options'] = {
    apiKey: apiKey,
    secret: secret
  };
  if (exchange === Exchange.FTX && subaccount) {
    options['headers'] = { [FTX_SUBACCOUNT_HEADER]: subaccount };
  }
  const instance = new ccxt[exchange](options);
  await checkAccountCredentials(instance, account);
  return instance;
};

export const refreshExchange = async (
  account: Account
): Promise<ccxt.Exchange> => {
  const { exchange } = account;
  const id = getAccountId(account);
  let instance = exchanges.get(id);
  if (!instance) {
    try {
      const intanceExchange = await getExchange(account);
      exchanges.set(id, intanceExchange);
      tickers.set(exchange, new Map<string, ccxt.Ticker>());
    } catch (err) {
      debug(err);
      error(EXCHANGE_INIT_ERROR(id, exchange));
      throw new ExchangeInstanceInitError(
        EXCHANGE_INIT_ERROR(id, exchange, err.message)
      );
    }
  }
  // we double check here
  instance = exchanges.get(id);
  if (!instance) {
    error(EXCHANGE_INIT_ERROR(id, exchange));
    throw new ExchangeInstanceInitError(EXCHANGE_INIT_ERROR(id, exchange));
  }
  debug(EXCHANGE_INIT_SUCCESS(id, exchange));
  return instance;
};

export const fetchTickerInfo = async (
  exchangeInstance: ccxt.Exchange,
  account: Account,
  symbol: string
): Promise<Ticker> => {
  const { exchange } = account;
  let ticker = tickers.get(exchange).get(symbol);
  if (!ticker) {
    try {
      const ticker: Ticker = await exchangeInstance.fetchTicker(symbol);
      tickers.get(exchange).set(symbol, ticker);
    } catch (err) {
      debug(err);
      error(TICKER_READ_ERROR(exchange, symbol));
      throw new TickerFetchError(
        TICKER_READ_ERROR(exchange, symbol, err.message)
      );
    }
  }
  // we double check here
  ticker = tickers.get(exchange).get(symbol);
  if (!ticker) {
    error(TICKER_READ_ERROR(exchange, symbol));
    throw new ExchangeInstanceInitError(TICKER_READ_ERROR(exchange, symbol));
  }
  debug(TICKER_READ_SUCCESS(exchange, symbol));
  return ticker;
};

export const fetchAvailableMarkets = async (
  market: Market
): Promise<IMarket[]> => {
  const { exchange } = market;
  try {
    const markets: ccxt.Market[] = await new ccxt[exchange]().fetchMarkets();
    const availableMarkets = markets.flatMap((m) =>
      m.active
        ? {
            id: m.id,
            symbol: m.symbol,
            base: m.base,
            quote: m.quote,
            type: m.type
          }
        : undefined
    );
    debug(MARKETS_READ_SUCCESS(exchange));
    return availableMarkets;
  } catch (err) {
    debug(err);
    error(MARKETS_READ_ERROR(exchange));
    throw new MarketsFetchError(MARKETS_READ_ERROR(exchange, err.message));
  }
};

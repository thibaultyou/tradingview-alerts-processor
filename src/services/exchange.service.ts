import { Account } from '../entities/account.entities';
import { checkAccountCredentials } from './account.service';
import { debug, error } from './logger.service';
import { Exchange, Ticker } from 'ccxt';
import {
  EXCHANGE_INIT_ERROR,
  EXCHANGE_INIT_SUCCESS,
  MARKETS_READ_ERROR,
  MARKETS_READ_SUCCESS,
  TICKER_READ_ERROR,
  TICKER_READ_SUCCESS
} from '../messages/exchange.messages';
import { ExchangeId } from '../constants/exchanges.constants';
import {
  ExchangeInstanceInitError,
  MarketsFetchError,
  TickerFetchError
} from '../errors/exchange.errors';
import { getAccountId } from '../utils/account.utils';
import {
  getBinanceFuturesUSDTTickerCurrentPositionSize,
  getBinanceSpotTickerCurrentBalance
} from '../utils/exchanges/binance.utils';
import { getExchangeOptions } from '../utils/exchange.utils';
import {
  getFTXFuturesTickerCurrentPositionSize,
  getFTXSpotTickerCurrentBalance
} from '../utils/exchanges/ftx.utils';
import { IMarket } from '../interfaces/market.interface';
import { Market } from '../entities/market.entities';
import ccxt = require('ccxt');

const exchanges = new Map<string, Exchange>();
const tickers = new Map<string, Map<string, Ticker>>();

export const getExchange = async (account: Account): Promise<Exchange> => {
  const { exchange } = account;
  const options = getExchangeOptions(account);
  const instance = new ccxt[exchange](options);
  await checkAccountCredentials(instance, account);
  return instance;
};

export const refreshExchange = async (account: Account): Promise<Exchange> => {
  const { exchange } = account;
  const id = getAccountId(account);
  let instance = exchanges.get(id);
  if (!instance) {
    try {
      const intanceExchange = await getExchange(account);
      exchanges.set(id, intanceExchange);
      tickers.set(exchange, new Map<string, Ticker>());
    } catch (err) {
      error(EXCHANGE_INIT_ERROR(id, exchange), err);
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
  instance: Exchange,
  account: Account,
  symbol: string
): Promise<Ticker> => {
  await refreshExchange(account);
  const { exchange } = account;
  let ticker = tickers.get(exchange).get(symbol);
  if (!ticker) {
    try {
      const ticker: Ticker = await instance.fetchTicker(symbol);
      tickers.get(exchange).set(symbol, ticker);
    } catch (err) {
      error(TICKER_READ_ERROR(exchange, symbol), err);
      throw new TickerFetchError(
        TICKER_READ_ERROR(exchange, symbol, err.message)
      );
    }
  }
  // we double check here
  ticker = tickers.get(exchange).get(symbol);
  if (!ticker) {
    error(TICKER_READ_ERROR(exchange, symbol));
    throw new TickerFetchError(TICKER_READ_ERROR(exchange, symbol));
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
    error(MARKETS_READ_ERROR(exchange), err);
    throw new MarketsFetchError(MARKETS_READ_ERROR(exchange, err.message));
  }
};

export const getTickerCurrentBalance = async (
  instance: Exchange,
  account: Account,
  ticker: Ticker,
  symbol: string
): Promise<number> => {
  const { exchange } = account;
  if (exchange === ExchangeId.Binance) {
    return await getBinanceSpotTickerCurrentBalance(
      instance,
      account,
      ticker,
      symbol
    );
  } else if (exchange === ExchangeId.BinanceFuturesUSD) {
    return await getBinanceFuturesUSDTTickerCurrentPositionSize(
      instance,
      account,
      ticker,
      symbol
    );
  } else if (exchange === ExchangeId.FTX) {
    return ticker.info.type === 'spot'
      ? await getFTXSpotTickerCurrentBalance(instance, account, ticker, symbol)
      : await getFTXFuturesTickerCurrentPositionSize(
          instance,
          account,
          ticker,
          symbol
        );
  }
};

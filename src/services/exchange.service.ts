import { Ticker } from 'ccxt';
import ccxt = require('ccxt');
import { Account } from '../entities/account.entities';
import { Trade } from '../entities/trade.entities';
import { IBalance, IBalances } from '../interfaces/exchange.interfaces';
import { getAccountId } from '../utils/account.utils';
import { debug, error } from './logger.service';
import { TradingService } from './trade.service';
import { Market } from '../entities/market.entities';
import { IMarket } from '../interfaces/market.interface';
import {
  Exchange,
  FTX_SUBACCOUNT_HEADER
} from '../constants/exchanges.constants';
import {
  BALANCE_READ_ERROR,
  BALANCE_READ_SUCCESS,
  EXCHANGE_INIT_ERROR,
  EXCHANGE_INIT_SUCCESS,
  MARKETS_READ_ERROR,
  MARKETS_READ_SUCCESS,
  TICKER_READ_ERROR,
  TICKER_READ_SUCCESS
} from '../messages/exchange.messages';
import {
  BalancesFetchError,
  ExchangeInstanceInitError,
  MarketsFetchError,
  TickerFetchError,
  TradeExecutionError
} from '../errors/exchange.errors';
import {
  TRADE_EXECUTION_ERROR,
  TRADE_EXECUTION_SUCCESS
} from '../messages/trade.messages';

const exchanges = new Map<string, ccxt.Exchange>();
const tickers = new Map<string, Map<string, ccxt.Ticker>>();
const tradingService = TradingService.getInstance();

export const refreshExchange = (account: Account): ccxt.Exchange => {
  const { exchange, subaccount, apiKey, secret } = account;
  const id = getAccountId(account);
  let instance = exchanges.get(id);
  if (!instance) {
    const options: ccxt.Exchange['options'] = {
      apiKey: apiKey,
      secret: secret
    };
    if (exchange === Exchange.FTX) {
      if (subaccount) {
        options['headers'] = { [FTX_SUBACCOUNT_HEADER]: subaccount };
      }
      try {
        exchanges.set(id, new ccxt.ftx(options));
        tickers.set(exchange, new Map<string, ccxt.Ticker>());
      } catch (err) {
        error(EXCHANGE_INIT_ERROR(id, exchange));
        throw new ExchangeInstanceInitError(EXCHANGE_INIT_ERROR(id, exchange));
      }
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

export const getAccountBalances = async (
  account: Account
): Promise<IBalance[]> => {
  const id = getAccountId(account);
  try {
    const result: IBalances = await refreshExchange(account).fetch_balance();
    const balances = result.info.result.map((b) => ({
      coin: b.coin,
      free: b.free,
      total: b.total
    }));
    debug(BALANCE_READ_SUCCESS(id));
    return balances;
  } catch (err) {
    error(BALANCE_READ_ERROR(id));
    throw new BalancesFetchError(BALANCE_READ_ERROR(id));
  }
};

export const fetchTickerPrice = async (
  account: Account,
  symbol: string
): Promise<Ticker> => {
  const { exchange } = account;
  let ticker = tickers.get(exchange).get(symbol);
  if (!ticker) {
    try {
      const ticker: Ticker = await refreshExchange(account).fetchTicker(symbol);
      tickers.get(exchange).set(symbol, ticker);
    } catch (err) {
      error(TICKER_READ_ERROR(exchange, symbol));
      throw new TickerFetchError(TICKER_READ_ERROR(exchange, symbol));
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

export const executeTrade = (account: Account, trade: Trade): boolean => {
  const { stub } = account;
  const { symbol, direction } = trade;
  try {
    const exchange = refreshExchange(account);
    tradingService.addTrade({ exchange, account, trade });
    debug(TRADE_EXECUTION_SUCCESS(stub, symbol, direction));
  } catch (err) {
    error(TRADE_EXECUTION_ERROR(stub, symbol, direction));
    throw new TradeExecutionError(
      TRADE_EXECUTION_ERROR(stub, symbol, direction)
    );
  }
  return true;
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
    error(MARKETS_READ_ERROR(exchange));
    throw new MarketsFetchError(MARKETS_READ_ERROR(exchange));
  }
};

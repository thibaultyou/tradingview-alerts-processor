import { Ticker, Exchange } from 'ccxt';
import { ExchangeId } from '../constants/exchanges.constants';
import { Side } from '../constants/trade.constants';
import { Account } from '../entities/account.entities';
import { Trade } from '../entities/trade.entities';
import {
  ClosePositionError,
  OpenPositionError,
  OrderSizeError
} from '../errors/trade.errors';
import { IOrderOptions } from '../interfaces/trade.interface';
import {
  CLOSE_TRADE_ERROR_NOT_FOUND,
  OPEN_TRADE_ERROR_MAX_SIZE,
  TRADE_ERROR_SIZE
} from '../messages/trade.messages';
import { getTickerCurrentBalance } from '../services/exchange.service';
import { error } from '../services/logger.service';
import { getAccountId } from './account.utils';
import {
  updateBinanceFuturesUSDCloseOrderOptions,
  updateBinanceSpotCloseOrderOptions
} from './exchanges/binance.utils';
import {
  updateFTXFuturesCloseOrderOptions,
  updateFTXSpotCloseOrderOptions
} from './exchanges/ftx.utils';

export const getTradeSide = (side: Side): Side =>
  side === Side.Close
    ? Side.Close
    : side === Side.Sell || side === Side.Short
    ? Side.Sell
    : Side.Buy;

export const getInvertedTradeSide = (side: Side): 'buy' | 'sell' =>
  side === Side.Sell || side === Side.Short ? Side.Buy : Side.Sell;

export const getAverageTradeSize = (
  exchange: ExchangeId,
  ticker: Ticker,
  size: string | number
): number => {
  const { ask, bid, high, low } = ticker;
  return exchange === ExchangeId.BinanceFuturesUSD
    ? Number(size) / ((high + low) / 2)
    : Number(size) / ((ask + bid) / 2);
};

export const getCloseOrderSize = (
  requestSize: string,
  currentSize: number
): number => {
  let orderSize = currentSize;
  if (requestSize && requestSize.includes('%')) {
    const percent = Number(requestSize.replace(/\D/g, ''));
    if (percent < 1 || percent > 100) {
      error(TRADE_ERROR_SIZE(requestSize));
      throw new OrderSizeError(TRADE_ERROR_SIZE(requestSize));
    }
    orderSize = (orderSize * percent) / 100;
  }
  return orderSize;
};

export const getSizeInDollars = (
  exchange: ExchangeId,
  ticker: Ticker,
  size: number | string
): number => {
  const { ask, bid, high, low } = ticker;
  let dollars =
    exchange === ExchangeId.BinanceFuturesUSD
      ? Number(size) * ((high + low) / 2)
      : Number(size) * ((ask + bid) / 2);
  dollars = +dollars.toFixed(2);
  return dollars;
};

export const getCloseOrderOptions = async (
  instance: Exchange,
  account: Account,
  trade: Trade,
  ticker: Ticker
): Promise<IOrderOptions> => {
  const { size, symbol } = trade;
  const { exchange } = account;
  const id = getAccountId(account);
  const options: IOrderOptions = {
    size: 0,
    side: 'sell'
  };

  if (exchange === ExchangeId.FTX) {
    if (ticker.info.type === 'spot') {
      await updateFTXSpotCloseOrderOptions(
        instance,
        account,
        ticker.info.baseCurrency,
        options
      );
    } else {
      await updateFTXFuturesCloseOrderOptions(
        instance,
        ticker.info.name,
        options
      );
    }
  } else if (exchange === ExchangeId.Binance) {
    await updateBinanceSpotCloseOrderOptions(
      instance,
      account,
      symbol,
      options
    );
  } else if (exchange === ExchangeId.BinanceFuturesUSD) {
    await updateBinanceFuturesUSDCloseOrderOptions(instance, symbol, options);
  }

  if (!options.size) {
    error(CLOSE_TRADE_ERROR_NOT_FOUND(exchange, id, symbol));
    throw new ClosePositionError(
      CLOSE_TRADE_ERROR_NOT_FOUND(exchange, id, symbol)
    );
  }

  options.size = getCloseOrderSize(size, options.size);
  return options;
};

export const handleMaxBudget = async (
  instance: Exchange,
  account: Account,
  ticker: Ticker,
  trade: Trade,
  orderSize: number
): Promise<void> => {
  const { symbol, max, direction } = trade;
  const { exchange } = account;
  const id = getAccountId(account);
  const side = getTradeSide(direction);
  const current = await getTickerCurrentBalance(
    instance,
    account,
    ticker,
    symbol
  );
  if (current + getSizeInDollars(exchange, ticker, orderSize) > Number(max)) {
    error(OPEN_TRADE_ERROR_MAX_SIZE(exchange, id, symbol, side, max));
    throw new OpenPositionError(
      OPEN_TRADE_ERROR_MAX_SIZE(exchange, id, symbol, side, max)
    );
  }
};

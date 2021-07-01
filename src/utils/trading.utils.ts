import { Ticker } from 'ccxt';
import { Side } from '../constants/trading.constants';
import { OrderSizeError } from '../errors/trading.errors';
import {
  TRADE_CALCULATED_SIZE,
  TRADE_CALCULATED_CLOSING_SIZE,
  TRADE_ERROR_SIZE,
  TRADE_CALCULATED_SIZE_ERROR
} from '../messages/trading.messages';
import { debug, error } from '../services/logger.service';

// we have to do this mapping for ccxt order, disgusting right ?
export const getTradeSide = (side: Side): Side =>
  side === Side.Close
    ? Side.Close
    : side === Side.Sell || side === Side.Short
    ? Side.Sell
    : Side.Buy;

export const getInvertedTradeSide = (side: Side): 'buy' | 'sell' =>
  side === Side.Sell || side === Side.Short ? Side.Buy : Side.Sell;

// TODO refacto specific
export const getTradeSize = (ticker: Ticker, sizeInDollars: number): number => {
  const { info, symbol } = ticker;
  const sizeInTokens = info.price
    ? sizeInDollars / Number(info.price) // FTX
    : sizeInDollars / Number(info.lastPrice); // Binance
  if (isNaN(sizeInTokens)) {
    error(TRADE_CALCULATED_SIZE_ERROR(symbol));
    throw new OrderSizeError(TRADE_CALCULATED_SIZE_ERROR(symbol));
  }
  debug(
    TRADE_CALCULATED_SIZE(
      symbol,
      sizeInTokens.toString(),
      sizeInDollars.toString()
    )
  );
  return sizeInTokens;
};

// TOOD rename
export const getDollarsSize = (ticker: Ticker, amount: number): number => {
  const { info, symbol } = ticker;
  const sizeInDollars = info.price
    ? Number(info.price) * amount // FTX
    : Number(info.lastPrice) * amount; // Binance
  if (isNaN(sizeInDollars)) {
    error(TRADE_CALCULATED_SIZE_ERROR(symbol));
    throw new OrderSizeError(TRADE_CALCULATED_SIZE_ERROR(symbol));
  }
  debug(
    TRADE_CALCULATED_SIZE(symbol, amount.toString(), sizeInDollars.toString())
  );
  return sizeInDollars;
};

// TODO allow absolute closing size ?
export const getCloseOrderSize = (
  ticker: Ticker,
  closingSize: string,
  currentSize: number
): number => {
  let orderSize = currentSize;
  if (closingSize && closingSize.includes('%')) {
    const percent = Number(closingSize.replace(/\D/g, ''));
    if (percent < 1 || percent > 100) {
      error(TRADE_ERROR_SIZE(closingSize));
      throw new OrderSizeError(TRADE_ERROR_SIZE(closingSize));
    }
    orderSize = (orderSize * percent) / 100;
  }
  debug(TRADE_CALCULATED_CLOSING_SIZE(ticker.symbol, orderSize, currentSize));
  return orderSize;
};

export const isSideDifferent = (first: Side, second: Side): boolean =>
  getTradeSide(first) !== getTradeSide(second);

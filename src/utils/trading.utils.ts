import { Ticker } from 'ccxt';
import { Side } from '../constants/trading.constants';
import { OrderSizeError } from '../errors/trading.errors';
import {
  TOKEN_CALCULATED_SIZE_IN_DOLLARS,
  TRADE_ERROR_SIZE
} from '../messages/trading.messages';
import { debug, error } from '../services/logger.service';

// we have to do this mapping for ccxt order
export const getTradeSide = (side: Side): Side =>
  side === Side.Close
    ? Side.Close
    : side === Side.Sell || side === Side.Short
    ? Side.Sell
    : Side.Buy;

export const getInvertedTradeSide = (side: Side): 'buy' | 'sell' =>
  side === Side.Sell || side === Side.Short ? Side.Buy : Side.Sell;

export const getTradeSize = (ticker: Ticker, size: number): number => {
  const { ask, bid, high, low } = ticker;
  const sizeInDollars =
    high && low ? size / ((high + low) / 2) : size / ((ask + bid) / 2);
  debug(
    TOKEN_CALCULATED_SIZE_IN_DOLLARS(
      ticker.symbol,
      size,
      sizeInDollars.toFixed(2)
    )
  );
  return sizeInDollars;
};

export const getCloseOrderSize = (
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
  return orderSize;
};

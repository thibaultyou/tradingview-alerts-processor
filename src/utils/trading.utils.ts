import { Ticker } from 'ccxt';
import { Side } from '../constants/trading.constants';
import { OrderSizeError } from '../errors/trading.errors';
import {
  TRADE_CALCULATED_CLOSING_SIZE,
  TRADE_ERROR_SIZE
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

// TODO allow absolute closing size ?
// TODO refacto
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

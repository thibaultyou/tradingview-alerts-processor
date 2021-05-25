import { Ticker } from 'ccxt';
import { Side } from '../constants/trade.constants';
import { OrderSizeError } from '../errors/trade.errors';
import { TRADE_ERROR_SIZE } from '../messages/trade.messages';
import { error } from '../services/logger.service';

export const getTradeSide = (side: Side): Side =>
  side === Side.Close
    ? Side.Close
    : side === Side.Sell || side === Side.Short
    ? Side.Sell
    : Side.Buy;

export const getInvertedTradeSide = (side: Side): 'buy' | 'sell' =>
  side === Side.Sell || side === Side.Short ? Side.Buy : Side.Sell;

export const getAverageTradeSize = (ticker: Ticker, size: string): number => {
  const { ask, bid } = ticker;
  return Number(size) / ((ask + bid) / 2);
};

export const getOrderSize = (
  requestSize: string,
  currentPositionSize: string
): number => {
  let orderSize = Number(currentPositionSize);
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

import { Ticker } from 'ccxt';
import { ExchangeId } from '../constants/exchanges.constants';
import { Side } from '../constants/trading.constants';
import { OrderSizeError } from '../errors/trading.errors';
import { TRADE_ERROR_SIZE } from '../messages/trading.messages';
import { error } from '../services/logger.service';

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

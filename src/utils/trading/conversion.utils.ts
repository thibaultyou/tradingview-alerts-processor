import { Ticker } from 'ccxt';
import { ExchangeId } from '../../constants/exchanges.constants';
import { ConversionError } from '../../errors/exchange.errors';
import { OrderSizeError } from '../../errors/trading.errors';
import {
  TRADE_CALCULATED_SIZE,
  TRADE_CALCULATED_SIZE_ERROR,
  TRADE_ERROR_SIZE
} from '../../messages/trading.messages';
import { debug, error } from '../../services/logger.service';
import { getTickerPrice } from './ticker.utils';

export const getRelativeOrderSize = (balance: number, size: string): number => {
  const percent = Number(size.replace(/%/g, ''));
  if (percent <= 0 || percent > 100) {
    error(TRADE_ERROR_SIZE(size));
    throw new OrderSizeError(TRADE_ERROR_SIZE(size));
  }
  const orderSize = (balance * percent) / 100;
  // debug(TRADE_CALCULATED_RELATIVE_SIZE(balance.toFixed(2), size, orderSize));
  return orderSize;
};

export const getTokensAmount = (
  symbol: string,
  price: number,
  dollars: number
): number => {
  const tokens = dollars / price;
  if (isNaN(tokens)) {
    error(TRADE_CALCULATED_SIZE_ERROR(symbol));
    throw new ConversionError(TRADE_CALCULATED_SIZE_ERROR(symbol));
  }
  debug(TRADE_CALCULATED_SIZE(symbol, tokens, dollars.toFixed(2)));
  return tokens;
};

export const getTokensPrice = (
  symbol: string,
  price: number,
  tokens: number
): number => {
  const size = price * tokens;
  if (isNaN(size)) {
    error(TRADE_CALCULATED_SIZE_ERROR(symbol));
    throw new ConversionError(TRADE_CALCULATED_SIZE_ERROR(symbol));
  }
  debug(TRADE_CALCULATED_SIZE(symbol, tokens, size.toFixed(2)));
  return size;
};

export const getOrderCost = (
  ticker: Ticker,
  exchangeId: ExchangeId,
  tokens: number
): number => {
  const { symbol } = ticker;
  const price = getTickerPrice(ticker, exchangeId);
  return getTokensPrice(symbol, price, tokens);
};

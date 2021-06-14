import { ExchangeId } from '../constants/exchanges.constants';
import { Side } from '../constants/trade.constants';
import { formatExchange } from '../utils/exchange.utils';

export const TRADE_EXECUTION_SUCCESS = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  side: Side
): string =>
  `Trading - ${formatExchange(
    exchange
  )}/${accountId.toUpperCase()} - ${symbol} ${side} trade executed.`;

export const TRADE_EXECUTION_ERROR = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  side: Side,
  err?: string
): string =>
  `Trading - ${formatExchange(
    exchange
  )}/${accountId} - Unable to execute ${symbol} ${side} trade${
    err ? ' -> ' + err : ''
  }.`;

export const TRADE_SERVICE_START = (exchange: ExchangeId): string =>
  `Trading - ${formatExchange(exchange)} - Trading executor started.`;

export const TRADE_SERVICE_STOP = (exchange: ExchangeId): string =>
  `Trading - ${formatExchange(exchange)} - Trading executor stopped.`;

export const TRADE_SERVICE_ALREADY_STARTED = (exchange: ExchangeId): string =>
  `Trading - ${formatExchange(exchange)} - Trading executor already started.`;

export const TRADE_SERVICE_ALREADY_STOPPED = (exchange: ExchangeId): string =>
  `Trading - ${formatExchange(exchange)} - Trading executor already stopped.`;

export const TRADE_SERVICE_ADD = (exchange: ExchangeId): string =>
  `Trading - ${formatExchange(exchange)} - Adding trade to executor.`;

export const CLOSE_TRADE_SUCCESS = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  absolute: number,
  percentage?: string
): string =>
  `Trading - ${formatExchange(
    exchange
  )}/${accountId} - $$$ Closing ${percentage} of open position / available balance for ${symbol} (~ ${absolute} $US).`;

export const CLOSE_TRADE_ERROR_NOT_FOUND = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string
): string =>
  `Trading - ${formatExchange(
    exchange
  )}/${accountId} - No open position / available balance found for ${symbol}.`;

export const CLOSE_TRADE_ERROR = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string
): string =>
  `Trading - ${formatExchange(
    exchange
  )}/${accountId} - Failed to close ${symbol} position.`;

export const OPEN_LONG_TRADE_SUCCESS = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  size: string
): string =>
  `Trading - ${formatExchange(
    exchange
  )}/${accountId} - ^^^ Opening long position ${symbol} (~ ${size} $US).`;

export const OPEN_SHORT_TRADE_SUCCESS = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  size: string
): string =>
  `Trading - ${formatExchange(
    exchange
  )}/${accountId} - vvv Opening short position ${symbol} (~ ${size} $US).`;

export const BUY_TRADE_SUCCESS = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  size: string
): string =>
  `Trading - ${formatExchange(
    exchange
  )}/${accountId} - ^^^ Buying ${symbol} (~ ${size} $US).`;

export const SELL_TRADE_SUCCESS = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  size: string
): string =>
  `Trading - ${formatExchange(
    exchange
  )}/${accountId} - vvv Selling ${symbol} (~ ${size} $US).`;

export const REVERSING_TRADE = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string
): string =>
  `Trading - ${formatExchange(
    exchange
  )}/${accountId} - xxx Reversing position ${symbol}.`;

export const OPEN_TRADE_ERROR = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  side: Side
): string =>
  `Trading - ${formatExchange(
    exchange
  )}/${accountId} - Failed to open ${side} position for ${symbol}.`;

export const OPEN_TRADE_ERROR_MAX_SIZE = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  side: Side,
  max: string
): string =>
  `Trading - ${formatExchange(
    exchange
  )}/${accountId} - Failed to open ${side} position for ${symbol}, max size reached (${max} $US).`;

export const TRADE_ERROR_SIZE = (size: string): string =>
  `Trading - Size percentage not valid, must be between 1 and 100 : ${size}.`;

export const TRADE_EXECUTION_TIME = (start: Date, end: Date): string =>
  `Trading - Trade executed in ${end.getTime() - start.getTime()} ms.`;

export const OPEN_TRADE_NO_CURRENT_OPENED_POSITION = (
  accountId: string,
  exchange: ExchangeId,
  symbol: string
): string =>
  `Exchanges - ${formatExchange(
    exchange
  )}/${accountId} - No current position opened for ${symbol}.`;

import { ExchangeId } from '../constants/exchanges.constants';
import { Side } from '../constants/trading.constants';
import { formatExchange } from '../utils/exchanges/common.exchange.utils';
import { messageWrapper } from '../utils/logger.utils';

const tradingMessageWrapper = (messsage: string): string =>
  messageWrapper('trading', messsage);

export const TRADE_EXECUTION_SUCCESS = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  side: Side
): string =>
  tradingMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId.toUpperCase()} - ${symbol} ${side} trade executed.`
  );

export const TRADE_EXECUTION_ERROR = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  side: Side,
  err?: string
): string =>
  tradingMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - Unable to execute ${symbol} ${side} trade${
      err ? ' -> ' + err : ''
    }.`
  );

export const TRADE_SERVICE_START = (exchange: ExchangeId): string =>
  tradingMessageWrapper(
    `${formatExchange(exchange)} - Trading executor started.`
  );

export const TRADE_SERVICE_STOP = (exchange: ExchangeId): string =>
  tradingMessageWrapper(
    `${formatExchange(exchange)} - Trading executor stopped.`
  );

export const TRADE_SERVICE_ALREADY_STARTED = (exchange: ExchangeId): string =>
  tradingMessageWrapper(
    `${formatExchange(exchange)} - Trading executor already started.`
  );

export const TRADE_SERVICE_ALREADY_STOPPED = (exchange: ExchangeId): string =>
  tradingMessageWrapper(
    `${formatExchange(exchange)} - Trading executor already stopped.`
  );

export const TRADE_SERVICE_ADD = (exchange: ExchangeId): string =>
  tradingMessageWrapper(
    `${formatExchange(exchange)} - Adding trade to executor.`
  );

export const CLOSE_TRADE_SUCCESS = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  sizeInTokens: number,
  closingSize: string
): string => {
  const closingSizeMessage = closingSize.includes('%')
    ? closingSize
    : `${closingSize} $US`;
  return tradingMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - $$$ Closing ${closingSizeMessage} of open position / available balance (~ ${sizeInTokens} ${symbol}).`
  );
};

export const CLOSE_TRADE_ERROR_NOT_FOUND = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string
): string =>
  tradingMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - No open position / available balance found for ${symbol}.`
  );

export const CLOSE_TRADE_ERROR = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string
): string =>
  tradingMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - Failed to close ${symbol} position.`
  );

export const OPEN_LONG_TRADE_SUCCESS = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  size: string
): string =>
  tradingMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - ^^^ Opening long position / buying on ${symbol} (~ ${size} $US).`
  );

export const OPEN_SHORT_TRADE_SUCCESS = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  size: string
): string =>
  tradingMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - vvv Opening short position / selling on ${symbol} (~ ${size} $US).`
  );

export const REVERSING_TRADE = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string
): string =>
  tradingMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - xxx Reversing / closing if overflow position on ${symbol}.`
  );

export const REVERSING_TRADE_ERROR = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string
): string =>
  tradingMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - Failed to reverse position on ${symbol}.`
  );

export const OPEN_TRADE_ERROR = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  side: Side
): string =>
  tradingMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - Failed to open ${side} position on ${symbol}.`
  );

export const OPEN_TRADE_ERROR_MAX_SIZE = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  side: Side,
  max: string
): string =>
  tradingMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - Failed to open ${side} position on ${symbol}, max size reached (${max} $US).`
  );

export const TRADE_ERROR_SIZE = (size: string): string =>
  tradingMessageWrapper(
    `Size percentage not valid, must be between 1 and 100 : ${size}.`
  );

export const TRADE_EXECUTION_TIME = (
  start: Date,
  end: Date,
  id: string
): string =>
  tradingMessageWrapper(
    `Trade ${id} executed in ${end.getTime() - start.getTime()} ms.`
  );

export const TRADE_PROCESSING = (id: string): string =>
  tradingMessageWrapper(`Processing ${id} trade.`);

export const TRADE_CALCULATED_TOKEN_SIZE = (
  symbol: string,
  sizeInTokens: string,
  sizeInDollars: number
): string =>
  tradingMessageWrapper(
    `Calculated ${sizeInTokens} ${symbol} equivalent for ${sizeInDollars} $US.`
  );

export const TRADE_CALCULATED_TOKEN_SIZE_ERROR = (symbol: string): string =>
  tradingMessageWrapper(`Failed to convert ${symbol} equivalent.`);

export const TRADE_CALCULATED_CLOSING_SIZE = (
  symbol: string,
  orderSize: number,
  currentSize: number
): string => {
  const size =
    orderSize !== currentSize ? `${orderSize} of ${currentSize}` : orderSize;
  return tradingMessageWrapper(
    `Calculated ${size} ${symbol} closing order size.`
  );
};

import { Side } from '../constants/trade.constants';

export const TRADE_EXECUTION_SUCCESS = (
  accountId: string,
  symbol: string,
  side: Side
): string => `${symbol} ${side} trade executed for ${accountId} account.`;

export const TRADE_EXECUTION_ERROR = (
  accountId: string,
  symbol: string,
  side: Side,
  err?: string
): string =>
  `Unable to execute ${symbol} ${side} trade for ${accountId} account${
    err ? ' -> ' + err : ''
  }.`;

export const TRADE_SERVICE_INIT = `Trading service started.`;

export const TRADE_SERVICE_ADD = `Adding trade to exexutor.`;

export const CLOSE_TRADE_SUCCESS = (
  accountId: string,
  symbol: string,
  size?: string
): string =>
  `Closing ${
    size && size.includes('%') ? size : '100%'
  } of open position on ${symbol} for ${accountId} account.`;

export const CLOSE_TRADE_ERROR_NOT_FOUND = (
  accountId: string,
  symbol: string
): string => `No open position found on ${symbol} for ${accountId} account.`;

export const CLOSE_TRADE_ERROR = (accountId: string, symbol: string): string =>
  `Failed to close ${symbol} position for ${accountId} account.`;

export const OPEN_TRADE_SUCCESS = (
  accountId: string,
  symbol: string,
  side: Side,
  size: string
): string =>
  `Opening ${side} position on ${symbol} (${size} $US) for ${accountId} account.`;

export const OPEN_TRADE_ERROR = (
  accountId: string,
  symbol: string,
  side: Side
): string =>
  `Failed to open ${side} position on ${symbol} for ${accountId} account`;

export const TRADE_ERROR_SIZE = (size: string): string =>
  `Size percentage not valid, must be between 1 and 100 : ${size}.`;

export const TRADE_EXECUTION_TIME = (start: Date, end: Date): string =>
  `Trade executed in ${end.getTime() - start.getTime()} ms.`;

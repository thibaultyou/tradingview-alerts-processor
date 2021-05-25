import { Exchange } from '../constants/exchanges.constants';
import { formatExchange } from '../utils/exchange.utils';

export const BALANCE_READ_SUCCESS = (accountId: string): string =>
  `Balances successfully fetched for ${accountId} account.`;

export const BALANCE_READ_ERROR = (accountId: string): string =>
  `Unable to fetch balances for ${accountId} account.`;

export const MARKETS_READ_SUCCESS = (exchange: Exchange): string =>
  `Markets successfully fetched for ${exchange} exchange.`;

export const MARKETS_READ_ERROR = (exchange: Exchange): string =>
  `Unable to fetch ${exchange} markets.`;

export const EXCHANGE_INIT_ERROR = (
  accountId: string,
  exchange: Exchange
): string =>
  `Unable to init ${formatExchange(
    exchange
  )} exchange instance for ${accountId}.`;

export const EXCHANGE_INIT_SUCCESS = (
  accountId: string,
  exchange: Exchange
): string => `${formatExchange(exchange)} instance for ${accountId} loaded.`;

export const TICKER_READ_SUCCESS = (symbol: string): string =>
  `${symbol} ticker successfully fetched.`;

export const TICKER_READ_ERROR = (symbol: string): string =>
  `Failed to check "${symbol}" ticker`;

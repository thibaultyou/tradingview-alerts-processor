import { Exchange } from '../constants/exchanges.constants';
import { formatExchange } from '../utils/exchange.utils';

export const BALANCE_READ_SUCCESS = (accountId: string): string =>
  `Balances successfully fetched for ${accountId} account.`;

export const BALANCE_READ_ERROR = (accountId: string, err?: string): string =>
  `Unable to fetch balances for ${accountId} account${
    err ? ' -> ' + err : ''
  }.`;

export const MARKETS_READ_SUCCESS = (exchange: Exchange): string =>
  `Markets successfully fetched for ${exchange} exchange.`;

export const MARKETS_READ_ERROR = (exchange: Exchange, err?: string): string =>
  `Unable to fetch ${exchange} markets${err ? ' -> ' + err : ''}.`;

export const EXCHANGE_INIT_ERROR = (
  accountId: string,
  exchange: Exchange,
  err?: string
): string =>
  `Unable to init ${formatExchange(
    exchange
  )} exchange instance for ${accountId}${err ? ' -> ' + err : ''}.`;

export const EXCHANGE_INIT_SUCCESS = (
  accountId: string,
  exchange: Exchange
): string => `${formatExchange(exchange)} instance for ${accountId} loaded.`;

export const TICKER_READ_SUCCESS = (
  exchange: Exchange,
  symbol: string
): string =>
  `${symbol} ticker on ${formatExchange(exchange)} successfully fetched.`;

export const TICKER_READ_ERROR = (
  exchange: Exchange,
  symbol: string,
  err?: string
): string =>
  `Failed to check ${symbol} ticker on ${formatExchange(exchange)}${
    err ? ' -> ' + err : ''
  }.`;

export const EXCHANGE_AUTHENTICATION_ERROR = (
  accountId: string,
  exchange: Exchange,
  err?: string
): string =>
  `Failed to authenticate ${accountId} account on ${formatExchange(exchange)}${
    err ? ' -> ' + err : ''
  }.`;

export const EXCHANGE_AUTHENTICATION_SUCCESS = (
  accountId: string,
  exchange: Exchange
): string =>
  `${accountId} account successfully authenticated on ${formatExchange(
    exchange
  )}.`;

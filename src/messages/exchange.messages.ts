import { ExchangeId } from '../constants/exchanges.constants';
import { formatExchange } from '../utils/exchanges/common.exchange.utils';

export const TICKER_BALANCE_READ_SUCCESS = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string
): string =>
  `Balances - ${formatExchange(
    exchange
  )}/${accountId} - ${symbol} ticker balance successfully fetched.`;

export const TICKER_BALANCE_READ_ERROR = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  err?: string
): string =>
  `Balances - ${formatExchange(
    exchange
  )}/${accountId} - Unable to fetch ${symbol} ticker balance${
    err ? ' -> ' + err : ''
  }.`;

export const BALANCES_READ_SUCCESS = (
  exchange: ExchangeId,
  accountId: string
): string =>
  `Balances - ${formatExchange(
    exchange
  )}/${accountId} - Balances successfully fetched.`;

export const BALANCES_READ_ERROR = (
  exchange: ExchangeId,
  accountId: string,
  err?: string
): string =>
  `Balances - ${formatExchange(
    exchange
  )}/${accountId} - Unable to fetch balances${err ? ' -> ' + err : ''}.`;

export const MARKETS_READ_SUCCESS = (exchange: ExchangeId): string =>
  `Markets - ${formatExchange(exchange)} - Markets successfully fetched.`;

export const MARKETS_READ_ERROR = (
  exchange: ExchangeId,
  err?: string
): string =>
  `Markets - ${formatExchange(exchange)} - Unable to fetch markets${
    err ? ' -> ' + err : ''
  }.`;

export const EXCHANGE_INIT_ERROR = (
  accountId: string,
  exchange: ExchangeId,
  err?: string
): string =>
  `Exchanges - ${formatExchange(
    exchange
  )}/${accountId} - Unable to init exchange instance${
    err ? ' -> ' + err : ''
  }.`;

export const EXCHANGE_INIT_SUCCESS = (
  accountId: string,
  exchange: ExchangeId
): string =>
  `Exchanges - ${formatExchange(
    exchange
  )}/${accountId} - Instance successfully loaded.`;

export const TICKER_READ_SUCCESS = (
  exchange: ExchangeId,
  symbol: string
): string =>
  `Tickers - ${formatExchange(
    exchange
  )} - ${symbol} ticker successfully fetched.`;

export const TICKER_READ_ERROR = (
  exchange: ExchangeId,
  symbol: string,
  err?: string
): string =>
  `Tickers - ${formatExchange(exchange)} - Failed to check ${symbol} ticker${
    err ? ' -> ' + err : ''
  }.`;

export const EXCHANGE_AUTHENTICATION_ERROR = (
  accountId: string,
  exchange: ExchangeId,
  err?: string
): string =>
  `Exchanges - ${formatExchange(
    exchange
  )}/${accountId} - Failed to authenticate account${err ? ' -> ' + err : ''}.`;

export const EXCHANGE_AUTHENTICATION_SUCCESS = (
  accountId: string,
  exchange: ExchangeId
): string =>
  `Exchanges - ${formatExchange(
    exchange
  )}/${accountId} - Account successfully authenticated.`;

export const POSITIONS_READ_SUCCESS = (
  accountId: string,
  exchange: ExchangeId
): string =>
  `Exchanges - ${formatExchange(
    exchange
  )}/${accountId} - Current positions succesfully fetched.`;

export const POSITIONS_READ_ERROR = (
  accountId: string,
  exchange: ExchangeId,
  err?: string
): string =>
  `Exchanges - ${formatExchange(
    exchange
  )}/${accountId} - Failed to fetch current positions${
    err ? ' -> ' + err : ''
  }.`;

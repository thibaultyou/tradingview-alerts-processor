import { Ticker } from 'ccxt';
import { ExchangeId } from '../constants/exchanges.constants';
import { FuturesPosition } from '../types/exchanges.types';
import { formatExchange } from '../utils/exchanges/common.exchange.utils';
import { IBalance } from '../interfaces/exchanges/common.exchange.interfaces';
import { messageWrapper } from '../utils/logger.utils';

const exchangesMessageWrapper = (messsage: string): string =>
  messageWrapper('exchanges', messsage);

export const TICKER_BALANCE_READ_SUCCESS = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  balance: IBalance
): string =>
  exchangesMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - ${symbol} ticker balance successfully fetched. -> ${JSON.stringify(
      balance
    )}`
  );

export const TICKER_BALANCE_READ_ERROR = (
  exchange: ExchangeId,
  accountId: string,
  symbol: string,
  err?: string
): string =>
  exchangesMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - Unable to fetch ${symbol} ticker balance${
      err ? ' -> ' + err : ''
    }.`
  );

export const BALANCES_READ_SUCCESS = (
  exchange: ExchangeId,
  accountId: string
): string =>
  exchangesMessageWrapper(
    `${formatExchange(exchange)}/${accountId} - Balances successfully fetched.`
  );

export const BALANCES_READ_ERROR = (
  exchange: ExchangeId,
  accountId: string,
  err?: string
): string =>
  exchangesMessageWrapper(
    `${formatExchange(exchange)}/${accountId} - Unable to fetch balances${
      err ? ' -> ' + err : ''
    }.`
  );

export const MARKETS_READ_SUCCESS = (exchange: ExchangeId): string =>
  exchangesMessageWrapper(
    `${formatExchange(exchange)} - Markets successfully fetched.`
  );

export const MARKETS_READ_ERROR = (
  exchange: ExchangeId,
  err?: string
): string =>
  exchangesMessageWrapper(
    `${formatExchange(exchange)} - Unable to fetch markets${
      err ? ' -> ' + err : ''
    }.`
  );

export const EXCHANGE_INIT_ERROR = (
  accountId: string,
  exchange: ExchangeId,
  err?: string
): string =>
  exchangesMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - Unable to init exchange instance${
      err ? ' -> ' + err : ''
    }.`
  );

export const EXCHANGE_INIT_SUCCESS = (
  accountId: string,
  exchange: ExchangeId
): string =>
  exchangesMessageWrapper(
    `${formatExchange(exchange)}/${accountId} - Instance successfully loaded.`
  );

export const TICKER_READ_SUCCESS = (
  exchange: ExchangeId,
  symbol: string,
  ticker: Ticker
): string =>
  exchangesMessageWrapper(
    `${formatExchange(
      exchange
    )} - ${symbol} ticker successfully fetched. -> ${JSON.stringify(ticker)}`
  );

export const TICKER_READ_ERROR = (
  exchange: ExchangeId,
  symbol: string,
  err?: string
): string =>
  exchangesMessageWrapper(
    `${formatExchange(exchange)} - Failed to check ${symbol} ticker${
      err ? ' -> ' + err : ''
    }.`
  );

export const EXCHANGE_AUTHENTICATION_ERROR = (
  accountId: string,
  exchange: ExchangeId,
  err?: string
): string =>
  exchangesMessageWrapper(
    `${formatExchange(exchange)}/${accountId} - Failed to authenticate account${
      err ? ' -> ' + err : ''
    }.`
  );

export const EXCHANGE_AUTHENTICATION_SUCCESS = (
  accountId: string,
  exchange: ExchangeId
): string =>
  exchangesMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - Account successfully authenticated.`
  );

export const POSITIONS_READ_SUCCESS = (
  accountId: string,
  exchange: ExchangeId,
  positions: FuturesPosition[]
): string =>
  exchangesMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - Current positions succesfully fetched. -> ${JSON.stringify(
      positions
    )}`
  );

export const POSITION_READ_SUCCESS = (
  accountId: string,
  exchange: ExchangeId,
  symbol: string,
  position: FuturesPosition
): string =>
  exchangesMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - Current position for ${symbol} succesfully fetched. -> ${JSON.stringify(
      position
    )}`
  );

export const POSITIONS_READ_ERROR = (
  accountId: string,
  exchange: ExchangeId,
  err?: string
): string =>
  exchangesMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - Failed to fetch current positions${
      err ? ' -> ' + err : ''
    }.`
  );

export const POSITION_NOT_CURRENT = (
  accountId: string,
  exchange: ExchangeId,
  symbol: string
): string =>
  exchangesMessageWrapper(
    `${formatExchange(
      exchange
    )}/${accountId} - No current position opened for ${symbol}.`
  );

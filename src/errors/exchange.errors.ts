import { AbstractError } from './abstract.error';

export class ExchangeInstanceInitError extends AbstractError {}

export class BalancesFetchError extends AbstractError {}

export class MarketsFetchError extends AbstractError {}

export class TickerFetchError extends AbstractError {}

export class BalanceMissingError extends Error {}

export class PositionsFetchError extends AbstractError {}

export class ConversionError extends AbstractError {}

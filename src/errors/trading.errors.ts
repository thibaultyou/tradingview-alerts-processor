class AbstractError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class CreateOrderError extends AbstractError { }

export class OpenPositionError extends AbstractError { }

export class ClosePositionError extends AbstractError { }

export class OrderSizeError extends AbstractError { }

export class TradeExecutionError extends AbstractError { }

export class NoOpenPositionError extends AbstractError { }

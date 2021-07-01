export class OpenPositionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ClosePositionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class OrderSizeError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class TradeExecutionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NoOpenPositionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

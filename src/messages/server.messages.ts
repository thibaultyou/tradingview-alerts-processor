export const HEALTHCHECK_SUCCESS =
  'Tradingview alerts processor is up and running.';

export const SERVER_RUNNING = `Server - ${HEALTHCHECK_SUCCESS}`;

export const ROUTE_CALLED = (url: string, method: string): string =>
  `Server - Incoming request on ${url} route (${method}).`;

export const UNEXPECTED_ERROR = 'Something unexpected happened...';

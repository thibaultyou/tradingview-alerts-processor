import { messageWrapper } from '../utils/logger.utils';

const serverMessageWrapper = (messsage: string): string =>
  messageWrapper('server', messsage);

export const HEALTHCHECK_SUCCESS =
  'Tradingview alerts processor is up and running.';

export const GREETINGS = `Thank you for using this software, I hope you'll make $$$ with it.`;

export const ISSUES = `If you find anything you want me to add, fix or improve, please submit issues here : https://github.com/thibaultyou/tradingview-alerts-processor/issues.`;

export const DISCLAIMER = `Use it at your own risk and trade safely.`;

export const SERVER_RUNNING = `server|${HEALTHCHECK_SUCCESS}`;

export const ROUTE_CALLED = (url: string, method: string): string =>
  serverMessageWrapper(`Incoming request on ${url} route (${method}).`);

export const UNEXPECTED_ERROR = 'Something unexpected happened...';

import { accountRouter } from './account.routes';
import { healthRouter } from './health.routes';
import { tradingRouter } from './trading.routes';

export default {
  account: accountRouter,
  health: healthRouter,
  trading: tradingRouter
};

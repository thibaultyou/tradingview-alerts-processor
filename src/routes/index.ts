import { accountsRouter } from './account.routes';
import { balancesRouter } from './balance.routes';
import { healthRouter } from './health.routes';
import { marketsRouter } from './market.routes';
import { tradingRouter } from './trading.routes';

export default {
  accounts: accountsRouter,
  health: healthRouter,
  trading: tradingRouter,
  balances: balancesRouter,
  markets: marketsRouter
};

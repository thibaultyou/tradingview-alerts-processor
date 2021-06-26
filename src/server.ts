import express = require('express');
import { NODE_PORT } from './constants/env.constants';
import { postAccount, deleteAccount } from './routes/account.routes';
import { info } from './services/logger.service';
import {
  validateAccount,
  validateAccountStub
} from './validators/account.validators';
import { postTrade } from './routes/trade.routes';
import { validateTrade } from './validators/trade.validators';
import {
  HEALTH_ROUTE,
  ACCOUNTS_ROUTE,
  TRADES_ROUTE
} from './constants/routes.constants';
import { checkHealth } from './routes/health.routes';
import { loggingMiddleware } from './utils/logger.utils';
import { SERVER_RUNNING } from './messages/server.messages';
import { DatabaseService } from './services/db/db.service';

const app = express();

const PORT = process.env.PORT || NODE_PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// TODO add express router
app
  .route(ACCOUNTS_ROUTE)
  .post(loggingMiddleware, validateAccount, postAccount)
  // .get(loggingMiddleware, validateAccountStub, getAccount) // TODO replace with a list of account
  .delete(loggingMiddleware, validateAccountStub, deleteAccount);
app.post(TRADES_ROUTE, loggingMiddleware, validateTrade, postTrade);
app.get(HEALTH_ROUTE, loggingMiddleware, checkHealth);

app.listen(PORT, () => {
  DatabaseService.getDatabaseInstance();
  info(SERVER_RUNNING);
});

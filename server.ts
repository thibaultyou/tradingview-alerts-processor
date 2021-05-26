import express = require('express');
import { NODE_PORT } from './src/constants/env.constants';
import { getDatabase } from './src/db/store.db';
import {
  postAccount,
  getAccount,
  deleteAccount
} from './src/routes/account.routes';
import {
  getBalances,
  getMarkets,
  postTrade
} from './src/routes/exchange.routes';
import { info } from './src/services/logger.service';
import { TradingService } from './src/services/trade.service';
import {
  validateAccount,
  validateAccountStub
} from './src/validators/account.validators';
import { validateMarket } from './src/validators/market.validator';
import { validateTrade } from './src/validators/trade.validator';
import {
  ACCOUNTS_ROUTE,
  BALANCES_ROUTE,
  MARKETS_ROUTE,
  TRADES_ROUTE
} from './src/constants/routes.constants';

const app = express();
const tradingService = TradingService.getInstance();

const PORT = process.env.PORT || NODE_PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// TODO add express router
app.post(ACCOUNTS_ROUTE, validateAccount, postAccount);
app.get(ACCOUNTS_ROUTE, validateAccountStub, getAccount);
app.delete(ACCOUNTS_ROUTE, validateAccountStub, deleteAccount);
app.get(BALANCES_ROUTE, validateAccountStub, getBalances);
app.get(MARKETS_ROUTE, validateMarket, getMarkets);
app.post(TRADES_ROUTE, validateTrade, postTrade);

app.listen(PORT, () => {
  getDatabase();
  tradingService.start();
  info(`⚡ Server is running !`);
});

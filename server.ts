import express = require('express');
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

const app = express();
const tradingService = TradingService.getInstance();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/accounts', validateAccount, postAccount);
app.get('/accounts', validateAccountStub, getAccount);
app.delete('/accounts', validateAccountStub, deleteAccount);

app.get('/balances', validateAccountStub, getBalances);
app.get('/markets', validateMarket, getMarkets);
app.post('/trades', validateTrade, postTrade);

app.listen(PORT, () => {
  getDatabase();
  tradingService.start();
  info(`⚡ Server is running here 👉 http://localhost:${PORT} ⚡`);
});

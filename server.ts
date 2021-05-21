import express = require('express');
import { getDatabase } from './src/db/store.db';
import {
  postAccount,
  getAccount,
  deleteAccount
} from './src/routes/account.routes';
import { getBalances, postTrade } from './src/routes/exchange.routes';
import { TradingService } from './src/services/trade.service';
import {
  validateAccount,
  validateAccountStub
} from './src/validators/account.validators';
import { validateTrade } from './src/validators/trade.validators';

const app = express();
const tradingService = TradingService.getInstance();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/accounts', validateAccount, postAccount);
app.get('/accounts', validateAccountStub, getAccount);
app.delete('/accounts', validateAccountStub, deleteAccount);

app.get('/exchanges/balances', validateAccountStub, getBalances);
app.post('/exchanges/trade', validateTrade, postTrade);

app.listen(PORT, () => {
  getDatabase();
  tradingService.start();
  console.log(`⚡ Server is running here 👉 http://localhost:${PORT}`);
});

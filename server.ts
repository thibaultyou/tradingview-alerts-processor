import express = require('express');
import { getDatabase } from './src/db/store.db';
import {
  postAccount,
  getAccount,
  deleteAccount
} from './src/routes/account.routes';
import {
  validateAccount,
  validateAccountStub
} from './src/validators/account.validators';

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/accounts', validateAccount, postAccount);
app.get('/accounts', validateAccountStub, getAccount);
app.delete('/accounts', validateAccountStub, deleteAccount);

app.listen(PORT, () => {
  getDatabase();
  console.log(`⚡Server is running here 👉 http://localhost:${PORT}`);
});

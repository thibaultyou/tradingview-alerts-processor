import express = require('express');
import { NODE_PORT } from './constants/env.constants';
import { info } from './services/logger.service';
import { SERVER_RUNNING } from './messages/server.messages';
import { DatabaseService } from './services/db/db.service';
import { errorMiddleware } from './utils/errors.utils';
import routes from './routes';

const app = express();

const PORT = process.env.PORT || NODE_PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(errorMiddleware);

app.use(routes.account);
app.use(routes.trading);
app.use(routes.health);

app.listen(PORT, () => {
  DatabaseService.getDatabaseInstance();
  info(SERVER_RUNNING);
});

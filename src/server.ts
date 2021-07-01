import express = require('express');
import { NODE_PORT } from './constants/env.constants';
import { info, warning } from './services/logger.service';
import {
  SERVER_RUNNING,
  GREETINGS,
  ISSUES,
  DISCLAIMER
} from './messages/server.messages';
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
  info(GREETINGS);
  warning(ISSUES);
  warning(DISCLAIMER);
  DatabaseService.getDatabaseInstance();
  info(SERVER_RUNNING);
});

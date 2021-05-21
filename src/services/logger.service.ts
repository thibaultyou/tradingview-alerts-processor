import * as chalk from 'chalk';
import { Logger, createLogger, format, transports } from 'winston';
const { combine, json, timestamp } = format;
// eslint-disable-next-line no-console
const log = console.log;

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/debug.log' })
  ]
});

const tradesLogger = createLogger({
  level: 'info',
  format: combine(json(), timestamp()),
  transports: [new transports.File({ filename: 'logs/trades.log' })]
});

export const debug = (message: string): void => {
  logger.debug(message);
  log(chalk(message));
};

export const info = (message: string): void => {
  logger.info(message);
  log(chalk.blue(message));
};

export const warning = (message: string): void => {
  logger.warn(message);
  log(chalk.bold.yellow(message));
};

export const error = (message: string): void => {
  logger.error(message);
  log(chalk.bold.red(message));
};

export const long = (message: string): void => {
  tradesLogger.info(message);
  log(chalk.bold.blue(`🚀 ${message}`));
};

export const short = (message: string): void => {
  tradesLogger.info(message);
  log(chalk.bold.magenta(`🔥 ${message}`));
};

export const close = (message: string): void => {
  tradesLogger.info(message);
  log(chalk.bold.green(`💰 ${message}`));
};

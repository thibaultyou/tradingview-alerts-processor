import { createLogger, transports } from 'winston';
import {
  debugLogFileLoggerOptions,
  errorLogFileLoggerOptions,
  tradesLogFileLoggerOptions
} from '../utils/logger.utils';
import {
  consoleLoggerOptions,
  defaultLoggerFormat
} from '../utils/logger.utils';

const logger = createLogger({
  level: 'debug',
  format: defaultLoggerFormat,
  transports: [
    new transports.File(errorLogFileLoggerOptions),
    new transports.File(debugLogFileLoggerOptions)
  ]
});

const consoleLogger = createLogger({
  level: 'debug',
  format: defaultLoggerFormat,
  transports: [new transports.Console(consoleLoggerOptions)]
});

const tradesLogger = createLogger({
  level: 'info',
  format: defaultLoggerFormat,
  transports: [new transports.File(tradesLogFileLoggerOptions)]
});

export const debug = (message: string): void => {
  logger.debug(message);
  consoleLogger.debug(message);
};

export const info = (message: string): void => {
  logger.info(message);
  consoleLogger.info(message);
};

export const warning = (message: string): void => {
  logger.warn(message);
  consoleLogger.warn(message);
};

export const error = (message: string, error?: Record<string, any>): void => {
  if (!error) {
    logger.error(message);
    consoleLogger.error(message);
  } else {
    logger.error(message, { details: error });
    const formattedError = JSON.stringify(error);
    const hasError = error && formattedError !== '{}';
    consoleLogger.error(`${message}${hasError ? ' -> ' + formattedError : ''}`);
  }
};

export const long = (message: string): void => {
  logger.info(message);
  consoleLogger.info(message);
  tradesLogger.info(message);
};

export const short = (message: string): void => {
  logger.info(message);
  consoleLogger.info(message);
  tradesLogger.info(message);
};

export const close = (message: string): void => {
  logger.info(message);
  consoleLogger.info(message);
  tradesLogger.info(message);
};

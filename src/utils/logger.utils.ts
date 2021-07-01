import { Request, Response, NextFunction } from 'express';
import { debug } from '../services/logger.service';
import { format, transports } from 'winston';
import { ROUTE_CALLED } from '../messages/server.messages';
const { combine, json, timestamp, colorize } = format;

export const loggingMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  debug(ROUTE_CALLED(req.url, req.method));
  next();
};

export const defaultLoggerFormat = combine(timestamp(), json());

export const consoleLoggerOptions: transports.ConsoleTransportOptions = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    colorize(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp}:${level}:${message}`;
    })
  )
};

export const errorLogFileLoggerOptions: transports.FileTransportOptions = {
  filename: 'logs/error.log',
  level: 'error'
};

export const debugLogFileLoggerOptions: transports.FileTransportOptions = {
  filename: 'logs/debug.log'
};

export const tradesLogFileLoggerOptions: transports.FileTransportOptions = {
  filename: 'logs/trades.log'
};

export const messageWrapper = (prefix: string, message: string): string =>
  `${prefix}|${message}`;

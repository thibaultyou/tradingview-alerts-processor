import { Request, Response, NextFunction } from 'express';
import { HttpCode } from '../constants/http.constants';
import { UNEXPECTED_ERROR } from '../messages/server.messages';
import { error } from '../services/logger.service';

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  error(err.stack);
  res.status(HttpCode.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
  next();
};

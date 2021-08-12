import { Request, Response, NextFunction } from 'express';
import { Trade } from '../entities/trade.entities';
import { validateBody } from './main.validator';

export const validateTrade = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => validateBody(req, res, next, Trade);

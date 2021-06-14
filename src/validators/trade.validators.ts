import { Request, Response, NextFunction } from 'express';
import { Trade } from '../entities/trade.entities';
import { validateClass } from './main.validator';

export const validateTrade = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => validateClass(req, res, next, Trade);

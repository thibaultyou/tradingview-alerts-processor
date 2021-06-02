import { Request, Response, NextFunction } from 'express';
import { Market } from '../entities/market.entities';
import { validateClass } from './main.validator';

export const validateMarket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => validateClass(req, res, next, Market);

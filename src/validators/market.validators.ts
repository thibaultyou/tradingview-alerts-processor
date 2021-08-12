import { Request, Response, NextFunction } from 'express';
import { Market } from '../entities/market.entities';
import { validateParams } from './main.validator';

export const validateMarket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => validateParams(req, res, next, Market);

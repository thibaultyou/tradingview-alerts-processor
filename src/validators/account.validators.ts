import { Request, Response, NextFunction } from 'express';
import { Account, AccountId } from '../entities/account.entities';
import { validateBody, validateParams } from './main.validator';

export const validateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => validateBody(req, res, next, Account);

export const validateAccountId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => validateParams(req, res, next, AccountId);

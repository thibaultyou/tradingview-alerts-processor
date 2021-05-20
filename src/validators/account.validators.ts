import { Request, Response, NextFunction } from 'express';
import { Account, AccountStub } from '../entities/account.entities';
import { validateClass } from './main.validator';

export const validateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => validateClass(req, res, next, Account);

export const validateAccountStub = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => validateClass(req, res, next, AccountStub);

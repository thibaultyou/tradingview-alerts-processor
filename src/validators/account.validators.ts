import { transformAndValidate } from 'class-transformer-validator';
import { Request, Response, NextFunction } from 'express';
import { Account, AccountStub } from '../entities/account.entities';

export const validateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await transformAndValidate(Account, req.body, {
      validator: { enableDebugMessages: false }
    });
    next();
  } catch (err) {
    res.writeHead(400);
    res.write(`Account validation error : ${err}`);
    res.end();
  }
};

export const validateAccountStub = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await transformAndValidate(AccountStub, req.body, {
      validator: { enableDebugMessages: false }
    });
    next();
  } catch (err) {
    res.writeHead(400);
    res.write(`Account stub validation error : ${err}`);
    res.end();
  }
};

import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { Request, Response, NextFunction } from 'express';

export const validateClass = async (
  req: Request,
  res: Response,
  next: NextFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  classType: ClassType<any>
): Promise<void> => {
  try {
    await transformAndValidate(classType, req.body, {
      validator: { forbidUnknownValues: true }
    });
    next();
  } catch (err) {
    res.writeHead(400);
    res.write(
      JSON.stringify({
        message: 'Validation error',
        constraints: Object.values(err[0].constraints)
      })
    );
    res.end();
  }
};

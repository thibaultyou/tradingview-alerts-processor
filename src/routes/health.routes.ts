import { Request, Response } from 'express';

import { HEALTHCHECK_SUCCESS } from '../messages/server.messages';

// TODO add connected exchanges status
export const checkHealth = async (
  _req: Request,
  res: Response
): Promise<void> => {
  res.write(
    JSON.stringify({
      message: HEALTHCHECK_SUCCESS
    })
  );
  res.end();
};

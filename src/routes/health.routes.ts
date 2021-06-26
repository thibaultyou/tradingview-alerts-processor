import { Request, Response, Router } from 'express';
import { HEALTH_ROUTE } from '../constants/routes.constants';
import { HEALTHCHECK_SUCCESS } from '../messages/server.messages';
import { loggingMiddleware } from '../utils/logger.utils';

const router = Router();

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

export const healthRouter = router.get(
  HEALTH_ROUTE,
  loggingMiddleware,
  checkHealth
);

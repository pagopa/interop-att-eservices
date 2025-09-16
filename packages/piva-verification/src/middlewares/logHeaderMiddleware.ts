import { Request, Response, NextFunction } from "express";
import { logger } from "pdnd-common";

const logHeadersMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.info("Request Headers:");
  for (const [key, value] of Object.entries(req.headers)) {
    logger.info(`${key}: ${value}`);
  }
  logger.error(`${res}`);

  next();
};
export default logHeadersMiddleware;

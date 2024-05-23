import { Request, Response, NextFunction } from "express";
import { logger } from "pdnd-common";

// Middleware per loggare tutti gli header della richiesta
const logHeadersMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.info("logHeadersMiddleware - Request Headers:");
  for (const [key, value] of Object.entries(req.headers)) {
    logger.info(`${key}: ${value}`);
  }
  logger.error(`${res}`);

  next(); // Passa il controllo al middleware o route handler successivo
};
export default logHeadersMiddleware;

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { logger } from "pdnd-common";

const validateParamsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response<number, Record<string, string>> => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  logger.error(
    `validateParamsMiddleware: Errore di validazione:`,
    errors.array()
  );

  return res.status(400).json({ errors: "Bad request" });
};

export default validateParamsMiddleware;

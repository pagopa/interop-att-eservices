/* eslint-disable functional/immutable-data */
import { NextFunction, Request, Response } from "express";
import { getContext } from "pdnd-common";
import { readHeadersResidenceVerification } from "./headers.js";

export const contextDataResidenceMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const headers = readHeadersResidenceVerification(req);
  if (headers) {
    const context = getContext();
    context.authData = {
      purposeId: headers.purposeId,
      clientId: headers.clientId,
    };
    context.correlationId = headers?.correlationId;
  } else {
    const context = getContext();
    context.correlationId = Array.isArray(req.headers["x-correlation-id"])
      ? req.headers["x-correlation-id"][0]
      : req.headers["x-correlation-id"] ?? "";
  }
  next();
};

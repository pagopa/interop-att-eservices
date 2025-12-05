/* eslint-disable functional/immutable-data */
import { AsyncLocalStorage } from "async_hooks";
import { NextFunction, Request, Response } from "express";
import { zodiosContext } from "@zodios/express";
import { z } from "zod";
import { AuthData } from "../auth/authData.js";
import { ContextConfig } from "../config/contextConfig.js";

export type AppContext = z.infer<typeof ctx>;
export type ZodiosContext = NonNullable<typeof zodiosCtx>;
export type ExpressContext = NonNullable<typeof zodiosCtx.context>;

export const ctx = z.object({
  authData: AuthData,
  correlationId: z.string().uuid(),
});

export const zodiosCtx = zodiosContext(
  z.object({
    ctx,
  })
);

const config = ContextConfig.parse(process.env);

const globalStore = new AsyncLocalStorage<AppContext>();
const defaultAppContext: AppContext = {
  authData: {
    purposeId: config.purposeId,
    clientId: config.clientId,
  },
  correlationId: config.correlationId,
};

export const getContext = (): AppContext => {
  const context = globalStore.getStore();
  return !context ? defaultAppContext : context;
};

export const globalContextMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  globalStore.run(defaultAppContext, () => defaultAppContext);
  next();
};

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

type ContextState = {
  defaultContext: AppContext | undefined;
};

const state: ContextState = {
  defaultContext: undefined,
};

const globalStore = new AsyncLocalStorage<AppContext>();

export const initContext = (config: ContextConfig): void => {
  state.defaultContext = {
    authData: {
      purposeId: config.purposeId,
      clientId: config.clientId,
    },
    correlationId: config.correlationId,
  };
};

export const getContext = (): AppContext => {
  const context = globalStore.getStore();
  if (context) {
    return context;
  }

  if (!state.defaultContext) {
    throw new Error("Context not initialized. Call initContext(config) first.");
  }

  return state.defaultContext;
};

export const globalContextMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!state.defaultContext) {
    next();
    return;
  }
  globalStore.run(state.defaultContext, () => next());
};

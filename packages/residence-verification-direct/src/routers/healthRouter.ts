import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, HealtService, ZodiosContext } from "pdnd-common";
import { api } from "../model/generated/api.js";
import { residenceVerificationDirectConfig } from "../config/config.js";

const healthRouter = (
  ctx: ZodiosContext
): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const healthRouter = ctx.router(api.api);

  healthRouter.get(
    "/residence-verification-direct/status",
    async (req, res) => {
      if (!req) {
        return res.status(500);
      }
      const data = await HealtService.status(residenceVerificationDirectConfig);
      if (data) {
        return res.status(200).end();
      } else {
        return res.status(500);
      }
    }
  );

  return healthRouter;
};
export default healthRouter;

import { api } from "../model/generated/api.js";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";
import healtService from "../services/healtService.js"
import { logger } from "pdnd-common";

const healthRouter = (ctx: ZodiosContext): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
    const healthRouter = ctx.router(api.api);


healthRouter.get("/residence-verification/status", async (req, res) => {
      logger.info(`post request: ${req.body}`);
      // RispostaAR001
      const data = await healtService.statusRedis();
      if (data) {
        return res.status(200).end();
      } else {
        return res.status(500);
      }
    } 
  );

return healthRouter;

}
export default healthRouter;

  
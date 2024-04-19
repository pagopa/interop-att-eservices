import { api } from "../model/generated/api.js";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";


const healthRouter = (ctx: ZodiosContext): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
    const healthRouter = ctx.router(api.api);


healthRouter.get("/residence-verification/status", async (_, res) => res.status(200).end());

return healthRouter;

}
export default healthRouter;

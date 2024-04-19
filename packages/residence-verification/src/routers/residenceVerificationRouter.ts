import ResidenceVerificationController from "../controllers/residenceVerificationController.js";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { makeApiProblem } from "../exceptions/errors.js";
import { logger } from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";

const residenceVerificationRouter = (ctx: ZodiosContext): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const residenceVerificationRouter = ctx.router(api.api);


  residenceVerificationRouter.post("/residence-verification", async (req, res) => {
  try {
    logger.info(`post request: ${req.body}`);
    // RispostaAR001
    const data = await ResidenceVerificationController.findUser(req.body);
    if (data) {
      return res.status(200).json(data).end();
    } else {
      return res.status(500);
    }
  } catch (error) {
    const errorRes = makeApiProblem(error, createEserviceDataPreparation);
    return res.status(errorRes.status).json(errorRes).end();
  }
});
return residenceVerificationRouter;

}
export default residenceVerificationRouter;

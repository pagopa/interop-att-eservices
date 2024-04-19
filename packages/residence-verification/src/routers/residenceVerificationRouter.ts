import ResidenceVerificationController from "../controllers/residenceVerificationController.js";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { makeApiProblem, userModelNotFound } from "../exceptions/errors.js";
import { logger } from "pdnd-common";
import { ZodiosRouter } from "@zodios/express";
import { ZodiosEndpointDefinitions } from "@zodios/core";
import { ExpressContext, ZodiosContext } from "pdnd-common";
import {  authenticationMiddleware } from "pdnd-common";
import { integrityValidationMiddleware } from "../interoperability/integrityValidationMiddleware.js";
import { auditValidationMiddleware } from "../interoperability/auditValidationMiddleware.js";

const residenceVerificationRouter = (ctx: ZodiosContext): ZodiosRouter<ZodiosEndpointDefinitions, ExpressContext> => {
  const residenceVerificationRouter = ctx.router(api.api);

  residenceVerificationRouter.use(authenticationMiddleware(), integrityValidationMiddleware(), auditValidationMiddleware());

  residenceVerificationRouter.post("/residence-verification", async (req, res) => {
  try {
    logger.info(`[START] Post - '/ar-service-001' : ${req.body}`);
    const data = await ResidenceVerificationController.findUser(req.body);
    if (!data || data.soggetti?.soggetto?.length==0) {
      throw userModelNotFound();
    }
    logger.info(`[END] Post - '/ar-service-001'`);
    return res.status(200).json(data).end();
  } catch (error) {
    const errorRes = makeApiProblem(error, createEserviceDataPreparation);
    return res.status(errorRes.status).json(errorRes).end();
  }
});
return residenceVerificationRouter;

}
export default residenceVerificationRouter;

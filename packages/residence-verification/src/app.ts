import express from "express";
import { InteroperabilityConfig, authenticationMiddleware } from "pdnd-common";
import { zodiosCtx, contextDataMiddleware } from "pdnd-common";
import { integrityValidationMiddleware } from "./interoperability/integrityValidationMiddleware.js";
import { auditValidationMiddleware } from "./interoperability/auditValidationMiddleware.js";

import { logger } from "pdnd-common";
const app = zodiosCtx.app();
import dataPreparationRouter from "./routers/dataPreparationRouter.js";
 import residenceVerificationRouter from "./routers/residenceVerificationRouter.js";
import healthRouter from "./routers/healthRouter.js";

app.use(express.json());
app.use(contextDataMiddleware);
const config = InteroperabilityConfig.parse(process.env);
logger.info(
  `config.skipInteroperabilityVerification  ${config.skipInteroperabilityVerification}`
);


if (!config.skipInteroperabilityVerification) {
  app.use(authenticationMiddleware(),integrityValidationMiddleware(), auditValidationMiddleware()
 );
}

app.use("/", dataPreparationRouter(zodiosCtx));
app.use("/", residenceVerificationRouter(zodiosCtx));
app.use("/", healthRouter(zodiosCtx));


export default app;

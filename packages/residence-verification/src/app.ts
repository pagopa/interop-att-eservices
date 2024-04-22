import express from "express";
import { InteroperabilityConfig } from "pdnd-common";
import { zodiosCtx } from "pdnd-common";

import { logger } from "pdnd-common";
const app = zodiosCtx.app();
import dataPreparationRouter from "./routers/dataPreparationRouter.js";
 import residenceVerificationRouter from "./routers/residenceVerificationRouter.js";
import healthRouter from "./routers/healthRouter.js";

app.use(express.json());
const config = InteroperabilityConfig.parse(process.env);
logger.info(
  `config.skipInteroperabilityVerification  ${config.skipInteroperabilityVerification}`
);

/* if (!config.skipInteroperabilityVerification) {
  //app.use(authenticationMiddleware(),integrityValidationMiddleware(), auditValidationMiddleware() );
  app.use("/residence-verification/data-preparation", authenticationMiddleware(), integrityValidationMiddleware(), auditValidationMiddleware());
} */

app.use("/", healthRouter(zodiosCtx));
app.use("/", dataPreparationRouter(zodiosCtx));
app.use("/", residenceVerificationRouter(zodiosCtx));


export default app;

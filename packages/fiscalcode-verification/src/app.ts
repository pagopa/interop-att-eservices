import express from "express";
import { InteroperabilityConfig } from "pdnd-common";
import { zodiosCtx } from "pdnd-common";

import { logger } from "pdnd-common";
const app = zodiosCtx.app();
import dataPreparationHandshakeRouter from "./routers/dataPreparationHandshakeRouter.js";
import dataPreparationRouter from "./routers/dataPreparationRouter.js";

import fiscalcodeVerificationRouter from "./routers/fiscalcodeVerificationRouter.js"

import healthRouter from "./routers/healthRouter.js";

app.use(express.json());
const config = InteroperabilityConfig.parse(process.env);
logger.info(
  `config.skipInteroperabilityVerification  ${config.skipInteroperabilityVerification}`
);


app.use("/", healthRouter(zodiosCtx));
app.use("/", dataPreparationHandshakeRouter(zodiosCtx));
app.use("/", dataPreparationRouter(zodiosCtx));
app.use("/", fiscalcodeVerificationRouter(zodiosCtx));
export default app;

import express from "express";
import { Sequelize } from "sequelize";
import { DatabaseConfig, InteroperabilityConfig, zodiosCtx } from "pdnd-common";
import dataPreparationRouter from "./routers/dataPreparationRouter.js";

import healthRouter from "./routers/healthRouter.js";
import residenceVerificationRouter from "./routers/residenceVerificationRouter.js";

const config = InteroperabilityConfig.and(DatabaseConfig).parse(process.env);
export const dbInstance = new Sequelize(config.databaseUrl);

const app = zodiosCtx.app();
app.use(express.json());
app.use("/", healthRouter(zodiosCtx));
app.use("/", dataPreparationRouter(zodiosCtx));
app.use("/", residenceVerificationRouter(zodiosCtx));

export default app;

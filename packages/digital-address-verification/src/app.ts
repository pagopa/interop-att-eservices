import express from "express";
import { Sequelize } from "sequelize";
import { DatabaseConfig, InteroperabilityConfig, zodiosCtx } from "pdnd-common";
import dataPreparationRouter from "./routers/dataPreparationRouter.js";
import digitalAddressVerificationMultipleRouter from "./routers/digitalAddressVerificationMultipleRouter.js";
import digitalAddressVerificationSingleRouter from "./routers/digitalAddressVerificationSingleRouter.js";
import healthRouter from "./routers/healthRouter.js";

const config = InteroperabilityConfig.and(DatabaseConfig).parse(process.env);

export const dbInstance = new Sequelize(config.databaseUrl);
const app = zodiosCtx.app();

app.use(express.json());
app.use("/", healthRouter(zodiosCtx));
app.use("/", dataPreparationRouter(zodiosCtx));
app.use("/", digitalAddressVerificationMultipleRouter(zodiosCtx));
app.use("/", digitalAddressVerificationSingleRouter(zodiosCtx));

export default app;

import express from "express";
import { zodiosCtx } from "pdnd-common";
import dataPreparationHandshakeRouter from "./routers/dataPreparationHandshakeRouter.js";
import dataPreparationRouter from "./routers/dataPreparationRouter.js";
import pivaVerificationRouter from "./routers/pivaVerificationRouter.js";
import healthRouter from "./routers/healthRouter.js";

const app = zodiosCtx.app();
app.use(express.json());

app.use("/", healthRouter(zodiosCtx));
app.use("/", dataPreparationHandshakeRouter(zodiosCtx));
app.use("/", dataPreparationRouter(zodiosCtx));
app.use("/", pivaVerificationRouter(zodiosCtx));

export default app;

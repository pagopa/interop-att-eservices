import express from "express";
import { zodiosCtx } from "pdnd-common";
import healthRouter from "./routers/healthRouter.js";
import trialRouter from "./routers/trialRouters.js";

const app = zodiosCtx.app();
app.use(express.json());

app.use("/", healthRouter(zodiosCtx));
app.use("/", trialRouter(zodiosCtx));

export default app;

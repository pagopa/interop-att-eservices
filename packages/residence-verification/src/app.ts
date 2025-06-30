import express from "express";
import { zodiosCtx } from "pdnd-common";
import residenceVerificationRouter from "./routers/residenceVerificationRouter.js";
import healthRouter from "./routers/healthRouter.js";

const app = zodiosCtx.app();
app.use(express.json());
app.use("/", healthRouter(zodiosCtx));
app.use("/", residenceVerificationRouter(zodiosCtx));

export default app;

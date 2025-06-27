import express from "express";
import { zodiosCtx } from "pdnd-common";
import healthRouter from "./routers/healthRouter.js";
import residenceVerificationRouter from "./routers/residenceVerificationRouter.js";

const app = zodiosCtx.app();
app.use(express.json());
app.use("/", healthRouter(zodiosCtx));
app.use("/", residenceVerificationRouter(zodiosCtx));

export default app;

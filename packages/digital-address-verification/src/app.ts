import express from "express";
import { zodiosCtx } from "pdnd-common";
import dataPreparationRouter from "./routers/dataPreparationRouter.js";
import digitalAddressVerificationMultipleRouter from "./routers/digitalAddressVerificationMultipleRouter.js";
import digitalAddressVerificationSingleRouter from "./routers/digitalAddressVerificationSingleRouter.js";

import healthRouter from "./routers/healthRouter.js";

const app = zodiosCtx.app();
app.use(express.json());

app.use("/", healthRouter(zodiosCtx));
app.use("/", dataPreparationRouter(zodiosCtx));
app.use("/", digitalAddressVerificationMultipleRouter(zodiosCtx));
app.use("/", digitalAddressVerificationSingleRouter(zodiosCtx));

export default app;

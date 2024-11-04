import express from "express";
import { zodiosCtx } from "pdnd-common";
import keychainMockRouter from "./routers/keychain-mockRouter.js";
import healthRouter from "./routers/healthRouter.js";

const app = zodiosCtx.app();
app.use(express.json());

app.use("/", healthRouter(zodiosCtx));
app.use("/", keychainMockRouter(zodiosCtx));

export default app;

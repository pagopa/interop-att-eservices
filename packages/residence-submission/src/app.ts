import express from "express";
import { zodiosCtx } from "pdnd-common";
import residenceSubmissionRouter from "./routers/residenceSubmissionRouter.js";
import healthRouter from "./routers/healthRouter.js";
import { rawBodySaver } from "./middleware/rawBody.js";

const app = express();

app.use(express.json({ verify: rawBodySaver }));
app.use("/", healthRouter(zodiosCtx) as unknown as express.Router);
app.use("/", residenceSubmissionRouter(zodiosCtx) as unknown as express.Router);

export default app;

import express from "express";
import { zodiosCtx } from "pdnd-common";
import residenceVerificationRouter from "./routers/residenceVerificationRouter.js";
import { rawBodySaver } from "./middleware/rawBody.js";
import healthRouter from "./routers/healthRouter.js";

const app = express();
app.use(express.json({ verify: rawBodySaver }));
const expressRouter = express.Router();
const zodiosRouter = residenceVerificationRouter(zodiosCtx);
expressRouter.use(zodiosRouter as unknown as express.Router);
app.use("/", healthRouter(zodiosCtx) as unknown as express.Router);

app.use(
  "/",
  residenceVerificationRouter(zodiosCtx) as unknown as express.Router
);

export default app;

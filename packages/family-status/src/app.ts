import express from "express";
import { zodiosCtx } from "pdnd-common";
import dataPreparationRouter from "./routers/dataPreparationRouter.js";
import familyStatusRouter from "./routers/familyStatusRouter.js";
import healthRouter from "./routers/healthRouter.js";
import { rawBodySaver } from "./middleware/rawBody.js";

const app = express();
app.use(express.json({ verify: rawBodySaver }));

app.use("/", healthRouter(zodiosCtx) as unknown as express.Router);
app.use("/", dataPreparationRouter(zodiosCtx) as unknown as express.Router);
app.use("/", familyStatusRouter(zodiosCtx) as unknown as express.Router);

export default app;

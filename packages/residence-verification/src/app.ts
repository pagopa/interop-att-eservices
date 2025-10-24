// app.ts
import express from "express";
import { zodiosCtx } from "pdnd-common";
import {
  authenticationCorrelationMiddleware,
  integrityValidationMiddleware,
  auditValidationMiddleware,
} from "pdnd-common";
import residenceVerificationRouter from "./routers/residenceVerificationRouter.js";
import { rawBodySaver } from "./middleware/rawBody.js";
import healthRouter from "./routers/healthRouter.js";
import { contextDataResidenceMiddleware } from "./context/context.js";

const app = express();
app.use(express.json({ verify: rawBodySaver }));

app.use("/", healthRouter(zodiosCtx) as unknown as express.Router);

const residenceRouter = express.Router();
residenceRouter.use(contextDataResidenceMiddleware);
residenceRouter.use((req, res, next) => {
  (authenticationCorrelationMiddleware(true) as express.RequestHandler)(
    req,
    res,
    next
  );
});
residenceRouter.use((req, res, next) => {
  (integrityValidationMiddleware() as express.RequestHandler)(req, res, next);
});
residenceRouter.use((req, res, next) => {
  (auditValidationMiddleware() as express.RequestHandler)(req, res, next);
});
residenceRouter.use(
  "/",
  residenceVerificationRouter(zodiosCtx) as unknown as express.Router
);

app.use("/", residenceRouter);

export default app;

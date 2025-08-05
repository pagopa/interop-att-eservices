import express from "express";
import { HealtService, ZodiosContext } from "pdnd-common";
import { api } from "../model/generated/api.js";

const healthRouter = (ctx: ZodiosContext): express.Router => {
  const router = ctx.router(api.api);

  router.get("/residence-verification-direct/status", async (req, res) => {
    if (!req) {
      return res.status(500);
    }
    const data = await HealtService.status();
    if (data) {
      return res.status(200).end();
    } else {
      return res.status(500);
    }
  });

  return router as unknown as express.Router;
};
export default healthRouter;

import { ZodiosBodyByPath } from "@zodios/core";
import { api } from "./generated/api.js";

type Api = typeof api.api;

export type ByKid = ZodiosBodyByPath<
  Api,
  "get",
  "/keys/:kid"
>;


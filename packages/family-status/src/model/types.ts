import { ZodiosBodyByPath } from "@zodios/core";
import { api } from "./generated/api.js";

type Api = typeof api.api;

export type ApiDataPreparation = ZodiosBodyByPath<
  Api,
  "post",
  "/family-status/data-preparation"
>;

export type GenericJSON = Record<string, string>;

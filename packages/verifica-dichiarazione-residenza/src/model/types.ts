import { ZodiosBodyByPath } from "@zodios/core";
import { api } from "./generated/api.js";

type Api = typeof api.api;

export type ApiDataPreparation = ZodiosBodyByPath<
  Api,
  "post",
  "/ar-service-001/data-preparation"
>;

export type GenericJSON = Record<string, string>;

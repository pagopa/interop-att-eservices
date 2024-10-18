import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const CategoryResponse = z
  .object({
    id: z.number().int(),
    code: z.string(),
    description: z.string(),
    order: z.number(),
  })
  .partial()
  .passthrough();
const CheckResponse = z
  .object({
    id: z.number().int(),
    code: z.string(),
    description: z.string(),
    order: z.number(),
    category: CategoryResponse,
  })
  .partial()
  .passthrough();
const PaginatedTrialItem = z
  .object({
    id: z.number().int(),
    operation_path: z.string(),
    operation_method: z.string(),
    response: z.string(),
    created_date: z.string().datetime({ offset: true }),
    check: CheckResponse,
  })
  .partial()
  .passthrough();
const PaginatedTrials = z
  .object({
    purpose_id: z.string(),
    correlation_id: z.string(),
    trials: z.array(PaginatedTrialItem),
  })
  .partial()
  .passthrough();
const PaginatedTrialResponse = z
  .object({
    totalItems: z.number().int(),
    totalPages: z.number().int(),
    currentPage: z.number().int(),
    data: z.array(PaginatedTrials),
  })
  .partial()
  .passthrough();
const ProblemError = z
  .object({ code: z.string(), detail: z.string() })
  .passthrough();
const Problem = z
  .object({
    type: z.string(),
    status: z.number().int(),
    title: z.string(),
    correlationId: z.string().optional(),
    detail: z.string().optional(),
    errors: z.array(ProblemError).min(1),
  })
  .passthrough();

export const schemas = {
  CategoryResponse,
  CheckResponse,
  PaginatedTrialItem,
  PaginatedTrials,
  PaginatedTrialResponse,
  ProblemError,
  Problem,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/trial/category",
    alias: "GetAllCategories",
    description: `Get All Categories`,
    requestFormat: "json",
    response: z.array(CategoryResponse),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/trial/check",
    alias: "GetAllChecks",
    description: `Get All Checks`,
    requestFormat: "json",
    response: z.array(CheckResponse),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/trial/search",
    alias: "SelectPaginatedTrial",
    description: `Select paginated Trials results for a specific CorrelationId`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "purposeId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "correlationId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "path",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "method",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: PaginatedTrialResponse,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/trial/status",
    alias: "getStatus",
    description: `Return ok`,
    requestFormat: "json",
    response: z
      .object({
        type: z.string(),
        status: z.number().int(),
        title: z.string(),
        correlationId: z.string().optional(),
        detail: z.string().optional(),
        errors: z.array(ProblemError).min(1),
      })
      .passthrough(),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}

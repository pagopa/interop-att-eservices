/* eslint-disable */
import { Check, Category } from "trial"; // raw Drizzle table models
import type { InferSelectModel } from "drizzle-orm";

type CategoryModel = InferSelectModel<typeof Category>;

import { CategoryResponse, CheckResponse } from "./models.js";

export type CheckType = InferSelectModel<typeof Check>;
export type CategoryType = InferSelectModel<typeof Category>;

export const checkToCheckResponse = (check: any): CheckResponse => ({
  id: check.id,
  code: check.code,
  description: check.description ?? "",
  order: check.order,
  category: check.category
    ? {
        id: check.category.id,
        code: check.category.code,
        description: check.category.description ?? "",
        order: check.category.order,
        name: check.category.name ?? "",
        eservice: check.category.eservice,
      }
    : undefined,
});

export const categoryToCategoryResponse = (
  category: CategoryModel
): CategoryResponse => ({
  id: category.id,
  code: category.code,
  eservice: category.eservice,
  description: category.description ?? "", // handle possible null
  order: category.order,
});

// If paginatedTrialResponse is meant to mirror categoryToCategoryResponse
export const paginatedTrialResponse = categoryToCategoryResponse;
/* eslint-enable */

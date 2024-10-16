/* eslint-disable */
import { Category, Check } from "trial";
import {
  CategoryResponse,
  CheckResponse,
  // PaginatedTrialResponse,
  // PaginatedTrials,
  // PaginatedTrialItem,
} from "./models.js";

export const checkToCheckResponse = (check: Check): CheckResponse => ({
  id: check?.dataValues.id,
  code: check?.dataValues.code,
  description: check?.dataValues.description || "",
  order: check?.dataValues.order,
  category: categoryToCategoryResponse(check?.dataValues.category!),
});

export const categoryToCategoryResponse = (
  category: Category
): CategoryResponse => ({
  id: category?.dataValues.id,
  code: category?.dataValues.code,
  eservice: category?.dataValues.eservice,
  description: category?.dataValues.description || "",
  order: category?.dataValues.order,
});

export const paginatedTrialResponse = (
  category: Category
): CategoryResponse => ({
  id: category?.dataValues.id,
  code: category?.dataValues.code,
  eservice: category?.dataValues.eservice,
  description: category?.dataValues.description || "",
  order: category?.dataValues.order,
});
/* eslint-enable */

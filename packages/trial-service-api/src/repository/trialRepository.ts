/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable max-params */
import { eq, and, asc } from "drizzle-orm";
import { Trial, db, Check, Category } from "trial";
import {
  PaginatedTrialResponse,
  PaginatedTrials,
} from "../model/domain/models.js";

export class TrialRepository {
  public static async findPaginatedTrial(
    page: number,
    pageSize: number,
    purposeId: string,
    correlationId?: string,
    path?: string,
    method?: string
  ): Promise<PaginatedTrialResponse> {
    const offset = (page - 1) * pageSize;

    const filters = [eq(Trial.purpose_id, purposeId)];
    if (correlationId) {
      filters.push(eq(Trial.correlation_id, correlationId));
    }
    if (path) {
      filters.push(eq(Trial.operation_path, path));
    }
    if (method) {
      filters.push(eq(Trial.operation_method, method));
    }

    const trials = await db
      .select({
        id: Trial.id,
        purpose_id: Trial.purpose_id,
        correlation_id: Trial.correlation_id,
        operation_path: Trial.operation_path,
        operation_method: Trial.operation_method,
        response: Trial.response,
        created_date: Trial.created_date,
        check_id: Check.id,
        check_code: Check.code,
        check_description: Check.description,
        check_order: Check.order,
        category_id: Category.id,
      })
      .from(Trial)
      .leftJoin(Check, eq(Trial.check_id, Check.id))
      .leftJoin(Category, eq(Check.category_id, Category.id))
      .where(and(...filters))
      .orderBy(asc(Trial.id))
      .limit(pageSize)
      .offset(offset);

    const grouped = new Map<string, PaginatedTrials>();

    for (const trial of trials) {
      const key = `${trial.purpose_id}-${trial.correlation_id}`;
      let group = grouped.get(key);
      if (!group) {
        group = {
          purpose_id: trial.purpose_id,
          correlation_id: trial.correlation_id,
          trials: [],
        };
        grouped.set(key, group);
      }

      if (!group.trials) {
        group.trials = [];
      }

      group.trials.push({
        id: trial.id,
        operation_path: trial.operation_path,
        operation_method: trial.operation_method ?? undefined, // Convert null to undefined
        response: trial.response ?? undefined,
        created_date: trial.created_date
          ? trial.created_date.toISOString()
          : undefined,
        checks: trial.check_id
          ? [
              {
                id: trial.check_id,
                code: trial.check_code,
                description: trial.check_description,
                order: trial.check_order,
                category: trial.category_id ? trial.category_id : undefined,
              },
            ]
          : [],
      });
    }

    const data = Array.from(grouped.values());

    return {
      totalItems: data.length,
      totalPages: Math.ceil(data.length / pageSize),
      currentPage: page,
      data,
    };
  }
}

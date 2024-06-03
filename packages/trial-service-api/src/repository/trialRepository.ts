import { logger } from "pdnd-common";
import { sequelize } from "trial";
import { QueryTypes } from "sequelize";
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
    try {
      const offset = (page - 1) * pageSize;

      const whereConditions: string[] = [`t.purpose_id = :purposeId`];
      const replacements: any = {
        purposeId,
        offset,
        limit: pageSize,
        page,
        pageSize,
      };

      if (correlationId) {
        whereConditions.push(`t.correlation_id = :correlationId`);
        replacements.correlationId = correlationId;
      }
      if (path) {
        whereConditions.push(`t.operation_path = :path`);
        replacements.path = path;
      }
      if (method) {
        whereConditions.push(`t.operation_method = :method`);
        replacements.method = method;
      }

      const whereClause = whereConditions.join(" AND ");

      const query = `
                WITH paginated_trials AS (
                    SELECT
                        t.purpose_id,
                        t.correlation_id,
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'id', t.id,
                                'operation_path', t.operation_path,
                                'operation_method', t.operation_method,
                                'response', t.response,
                                'created_date', t.created_date,
                                'checks', (
                                    SELECT JSON_AGG(
                                        JSON_BUILD_OBJECT(
                                            'id', c.id,
                                            'code', c.code,
                                            'description', c.description,
                                            '"order"', c."order"
                                        )
                                        ORDER BY c.id ASC
                                    )
                                    FROM "check" c
                                    WHERE c.category_id = cat.id
                                )
                            )
                            ORDER BY t.id ASC
                        ) AS trials
                    FROM trial t
                    LEFT JOIN "check" c ON t.check_id = c.id
                    LEFT JOIN category cat ON c.category_id = cat.id
                    WHERE ${whereClause}
                    GROUP BY t.purpose_id, t.correlation_id
                    ORDER BY t.purpose_id, t.correlation_id
                    OFFSET :offset ROWS
                    LIMIT :limit
                )
                
                SELECT
                    json_build_object(
                        'totalItems', COUNT(*),
                        'totalPages', CEIL(COUNT(*)::NUMERIC / :pageSize),
                        'currentPage', :page,
                        'data', (
                            SELECT JSON_AGG(paginated_trials)
                            FROM paginated_trials
                        )
                    ) AS paginated_trial_query_result
                FROM paginated_trials;
            `;

      const [queryResult] = await sequelize.query<PaginatedTrialQueryResult>(
        query,
        {
          replacements,
          type: QueryTypes.SELECT,
          raw: true,
        }
      );

      const parsedResult: PaginatedTrialResponse = {
        totalItems: queryResult.paginated_trial_query_result.totalItems,
        totalPages: queryResult.paginated_trial_query_result.totalPages,
        currentPage: queryResult.paginated_trial_query_result.currentPage,
        data: queryResult.paginated_trial_query_result.data ?? [],
      };

      return parsedResult;
    } catch (error) {
      logger.error(
        `Errore durante la ricerca dei record Trial con correlationId '${correlationId}' con errore: ${error}`
      );
      throw error; // Rilancia l'errore per una gestione esterna se necessario
    }
  }
}

interface PaginatedTrialData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: PaginatedTrials[];
}

interface PaginatedTrialQueryResult {
  paginated_trial_query_result: PaginatedTrialData;
}

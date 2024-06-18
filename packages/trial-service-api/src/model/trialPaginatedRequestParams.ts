import { requestParamNotValid } from "../exceptions/errors.js";

export class TrialPaginatedRequestParams {
  public page?: number;
  public pageSize?: number;
  public purposeId?: string;
  public correlationId?: string;
  public path?: string;
  public method?: string;

  /* eslint-disable */
  constructor(query: any) {
    this.page = query.page;
    this.pageSize = query.pageSize;
    this.purposeId = query.purposeId;
    this.correlationId = query.correlationId;
    this.path = query.path;
    this.method = query.method;
  }

  public static validate(query: any): TrialPaginatedRequestParams {
    const params = new TrialPaginatedRequestParams(query);

    if (
      !params.page ||
      isNaN(params.page) ||
      params.page <= 0 ||
      params.page > 100
    ) {
      throw requestParamNotValid(
        "Param 'page' must be a number between 1 and 100"
      );
    }

    if (!params.pageSize || isNaN(params.pageSize) || params.pageSize <= 0) {
      throw requestParamNotValid("Param 'pageSize' must be a positive number");
    }

    if (!params.purposeId) {
      throw requestParamNotValid("Param 'purposeId' is required");
    }

    return params;
  }
  /* eslint-enable */
}

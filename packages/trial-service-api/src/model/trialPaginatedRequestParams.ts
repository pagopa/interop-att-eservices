import { requestParamNotValid } from "../exceptions/errors.js";

export class TrialPaginatedRequestParams {

    page?: number;
    pageSize?: number;
    purposeId?: string;
    correlationId?: string;
    path?: string;
    method?: string;

    constructor(query: any) {
        this.page = query.page ? parseInt(query.page, 10) : undefined;
        this.pageSize = query.pageSize ? parseInt(query.pageSize, 10) : undefined;
        this.purposeId = query.purposeId;
        this.correlationId = query.correlationId;
        this.path = query.path;
        this.method = query.method;
    }

    public static validate(request: TrialPaginatedRequestParams) {
        if (request.page==null || request.page<=0 || request.page>100) {
            throw requestParamNotValid("Param 'page' must be between 1 and 100");
        }
        
        if (!request.pageSize) {
            throw requestParamNotValid("Param 'pageSize' is required");
        }

        if (!request.purposeId) {
            throw requestParamNotValid("Param 'purposeId' is required");
        }
    }

}
export class ApiError<T> extends Error {
  public code: T;
  public title: string;
  public detail: string;
  public correlationId?: string;

  constructor({
    code,
    title,
    detail,
    correlationId,
  }: {
    code: T;
    title: string;
    detail: string;
    correlationId?: string;
  }) {
    super(detail);
    this.code = code;
    this.title = title;
    this.detail = detail;
    this.correlationId = correlationId;
  }
}

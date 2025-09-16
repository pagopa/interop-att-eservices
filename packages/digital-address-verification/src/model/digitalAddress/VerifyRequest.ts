export class VerifyRequest {
  public idRequest: string;
  public jsonRequest: string;
  public count: number;

  constructor(idRequest: string, jsonRequest: string, count: number) {
    this.idRequest = idRequest;
    this.jsonRequest = jsonRequest;
    this.count = count;
  }
}

import { v4 as uuidv4 } from "uuid";

export class VerifyRequest {
  public idRequest: string;
  public jsonRequest: string;
  public jsonResult: string;
  public count: number;

  constructor(jsonRequest: string, count: number, jsonResult: string) {
    this.idRequest = uuidv4();
    this.jsonRequest = jsonRequest;
    this.jsonResult = jsonResult;
    this.count = count;
  }
}

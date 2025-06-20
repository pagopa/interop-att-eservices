// import { v4 as uuidv4 } from "uuid";

export class VerifyRequest {
  public idRequest: string;
  public jsonRequest: string;
  public count: number;

  constructor(idRequest: string, jsonRequest: string, count: number) {
    this.idRequest = idRequest; // uuidv4();
    this.jsonRequest = jsonRequest;
    this.count = count;
  }
}

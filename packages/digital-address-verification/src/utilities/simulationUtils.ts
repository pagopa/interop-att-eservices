// File: /logic/simulationUtils.ts

import { VerifyRequest } from "../model/digitalAddress/VerifyRequest.js";

export function calculateUpdatedRequestState(
  request: VerifyRequest
): VerifyRequest {
  if (request.count <= 1) {
    return request;
  }

  const getMaxNumber = (): number => 5;
  const decrement = Math.floor(Math.random() * getMaxNumber()) + 1;
  const newCount = Math.max(1, request.count - decrement);

  return { ...request, count: newCount };
}

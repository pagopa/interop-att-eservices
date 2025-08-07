import { StatusProcessingRequestModel } from "pdnd-models";

export const statusMap: { [key: number]: StatusProcessingRequestModel } = {
  5: "PRESA_IN_CARICO",
  4: "IN_ELABORAZIONE",
  3: "IN_ELABORAZIONE",
  2: "IN_ELABORAZIONE",
  1: "DISPONIBILE",
};

export function getStatusFromNumber(num: number): StatusProcessingRequestModel {
  return statusMap[num];
}

export function getMaxNumber(): number {
  return Math.max(...Object.keys(statusMap).map(Number));
}

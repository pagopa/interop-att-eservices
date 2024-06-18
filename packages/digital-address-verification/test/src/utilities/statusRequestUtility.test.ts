import { describe, it, expect } from "vitest";
import {
  getStatusFromNumber,
  getMaxNumber,
  statusMap,
} from "../../../src/utilities/statusRequestUtility";

describe("getStatusFromNumber", () => {
  it('should return "PRESA_IN_CARICO" for input 5', () => {
    const result = getStatusFromNumber(5);
    expect(result).toBe("PRESA_IN_CARICO");
  });

  it('should return "IN_ELABORAZIONE" for inputs 4, 3, 2', () => {
    [4, 3, 2].forEach((num) => {
      const result = getStatusFromNumber(num);
      expect(result).toBe("IN_ELABORAZIONE");
    });
  });

  it('should return "DISPONIBILE" for input 1', () => {
    const result = getStatusFromNumber(1);
    expect(result).toBe("DISPONIBILE");
  });

  it("should return undefined for an input not in statusMap", () => {
    const result = getStatusFromNumber(0);
    expect(result).toBeUndefined();
  });
});

describe("getMaxNumber", () => {
  it("should return the maximum number in statusMap keys", () => {
    const maxNumber = getMaxNumber();
    const expectedMax = Math.max(...Object.keys(statusMap).map(Number));
    expect(maxNumber).toBe(expectedMax);
  });
});

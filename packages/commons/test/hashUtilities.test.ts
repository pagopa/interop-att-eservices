import { describe, it, expect } from "vitest";
import { generateHashFromString } from "../src/utility/hashUtility.js";

describe("generateHashFromString", () => {
  it("should generate the correct SHA-256 hash for an empty string", () => {
    const input = "";
    const expectedHash =
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

    const result = generateHashFromString(input);

    expect(result).toBe(expectedHash);
  });

  it("should generate different hashes for different strings", () => {
    const input1 = "hello";
    const input2 = "world";

    const result1 = generateHashFromString(input1);
    const result2 = generateHashFromString(input2);

    expect(result1).not.toBe(result2);
  });
});

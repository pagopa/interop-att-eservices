import { describe, it, expect } from "vitest";
import { generateHashFromString } from "pdnd-common";
import generateHash from "../src/utilities/hashUtilities.js";

describe("generateHash", () => {
  it("should generate the correct SHA-256 hash for an empty array", () => {
    const input: string[] = [];
    const expectedHash =
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

    const result = generateHash(input);

    expect(result).toBe(expectedHash);
  });

  it("should generate different hashes for different inputs", () => {
    const input1 = ["hello"];
    const input2 = ["world"];

    const result1 = generateHash(input1);
    const result2 = generateHash(input2);

    expect(result1).not.toBe(result2);
  });
});

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

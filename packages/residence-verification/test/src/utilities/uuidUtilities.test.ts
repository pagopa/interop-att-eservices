import { describe, it, expect } from "vitest";
import { v4 as uuidv4 } from "uuid";
import {
  generateRandomUUID,
  isValidUUID,
} from "../../../src/utilities/uuidUtilities";

describe("generateRandomUUID", () => {
  it("should return the existing UUID if provided", () => {
    const existingUUID = "123e4567-e89b-12d3-a456-426614174000";
    const result = generateRandomUUID(existingUUID);
    expect(result).toBe(existingUUID);
  });

  it("should generate a new UUID if no existing UUID is provided", () => {
    const result = generateRandomUUID();
    expect(isValidUUID(result)).toBe(true);
  });

  /*it('should generate a valid UUID if an invalid UUID is provided', () => {
    const invalidUUID = 'invalid-uuid';
    const result = generateRandomUUID(invalidUUID);
    expect(isValidUUID(result)).toBe(true);
  });*/

  it("should generate a valid UUID if no argument is provided", () => {
    const result = generateRandomUUID();
    expect(isValidUUID(result)).toBe(true);
  });
});

describe("isValidUUID", () => {
  /*it('should return true for a valid UUID', () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';
    expect(isValidUUID(validUUID)).toBe(true);
  });*/

  it("should return false for an invalid UUID", () => {
    const invalidUUID = "invalid-uuid";
    expect(isValidUUID(invalidUUID)).toBe(false);
  });

  it("should return false for a valid UUID with incorrect version", () => {
    const invalidVersionUUID = "123e4567-e89b-22d3-a456-426614174000"; // version 2 UUID
    expect(isValidUUID(invalidVersionUUID)).toBe(false);
  });

  it("should return false for an empty string", () => {
    expect(isValidUUID("")).toBe(false);
  });

  it("should return false for a malformed UUID", () => {
    const malformedUUID = "123e4567-e89b-12d3-a456-426614174";
    expect(isValidUUID(malformedUUID)).toBe(false);
  });
});

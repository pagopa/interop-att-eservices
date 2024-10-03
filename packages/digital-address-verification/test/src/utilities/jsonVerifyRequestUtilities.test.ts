import { describe, it, expect, vi } from "vitest";
import { classToPlain } from "class-transformer";
import { logger } from "pdnd-common";
import {
  parseJsonToVerifyRequest,
  parseJsonToVerifyRequestArray,
  convertStringToVerifyRequest,
  convertStringToResponseRequestDigitalAddress,
} from "../../../src/utilities/jsonVerifyRequestUtilities.js";
import { VerifyRequest } from "../../../src/model/digitalAddress/VerifyRequest.js";

// Mock data

const validVerifyRequestJsonString =
  '{"idRequest": "12345", "jsonRequest": "{}", "count": 1}';
const invalidJsonString = "{idRequest: 12345}";
const validVerifyRequestArrayJsonString =
  '[{"idRequest": "12345", "jsonRequest": "{}", "count": 1}]';
const validResponseRequestDigitalAddressJsonString =
  '{"digitalAddress": "address1", "idSubject": "ABC123", "from": "2024-01-01"}';

// Mock the logger
vi.mock("pdnd-common", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe("parseJsonToVerifyRequest", () => {
  it("should return null if inputString is null", () => {
    const result = parseJsonToVerifyRequest(null);
    expect(result).toBeNull();
  });

  it("should return a parsed object for valid JSON string", () => {
    const result = parseJsonToVerifyRequest(
      validVerifyRequestJsonString
    ) as VerifyRequest;
    expect(result).toEqual(
      classToPlain(JSON.parse(validVerifyRequestJsonString)) as VerifyRequest
    );
  });

  it("should log an error and return null for invalid JSON string", () => {
    const result = parseJsonToVerifyRequest(invalidJsonString);
    expect(result).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Errore durante il parsing della stringa JSON")
    );
  });
});

describe("parseJsonToVerifyRequestArray", () => {
  it("should return null if inputString is null", () => {
    const result = parseJsonToVerifyRequestArray(null);
    expect(result).toBeNull();
  });

  it("should return a parsed array for valid JSON string", () => {
    const result = parseJsonToVerifyRequestArray(
      validVerifyRequestArrayJsonString
    ) as VerifyRequest[];
    expect(result).toEqual(
      JSON.parse(validVerifyRequestArrayJsonString).map(
        (item: any) => classToPlain(item) as VerifyRequest
      )
    );
  });

  it("should log an error and return null for invalid JSON string", () => {
    const result = parseJsonToVerifyRequestArray(invalidJsonString);
    expect(result).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Errore durante il parsing della stringa JSON")
    );
  });

  it("should throw an error if JSON does not represent an array", () => {
    const notArrayJsonString =
      '{"idRequest": "12345", "jsonRequest": "{}", "count": 1}';
    const result = parseJsonToVerifyRequestArray(notArrayJsonString);
    expect(result).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Errore durante il parsing della stringa JSON")
    );
  });
});

describe("convertStringToVerifyRequest", () => {
  it("should return a parsed object for valid JSON string", () => {
    const result = convertStringToVerifyRequest(validVerifyRequestJsonString);
    expect(result).toEqual({
      idRequest: "12345",
      jsonRequest: "{}",
      count: 1,
    });
  });

  it("should throw an error for invalid JSON string", () => {
    expect(() => convertStringToVerifyRequest(invalidJsonString)).toThrow(
      SyntaxError
    );
  });
});

describe("convertStringToResponseRequestDigitalAddress", () => {
  it("should return a parsed object for valid JSON string", () => {
    const result = convertStringToResponseRequestDigitalAddress(
      validResponseRequestDigitalAddressJsonString
    );
    expect(result).toEqual({
      digitalAddress: "address1",
      idSubject: "ABC123",
      from: "2024-01-01",
    });
  });

  it("should throw an error for invalid JSON string", () => {
    expect(() =>
      convertStringToResponseRequestDigitalAddress(invalidJsonString)
    ).toThrow(SyntaxError);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { classToPlain } from 'class-transformer';
import { logger } from 'pdnd-common';
import { parseJsonToRequestListDigitalAddress } from "../../../src/utilities/jsonDigitalAddressUtilities.js";

import {
    RequestListDigitalAddress,
  } from "../../../src/model/domain/models.js";
// Mock data
const validJsonString = '{"someField": "someValue"}';
const invalidJsonString = '{someField: someValue}';
const validObject = { someField: 'someValue' };

// Mock the logger
vi.mock('pdnd-common', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('parseJsonToRequestListDigitalAddress', () => {
  it('should return null if inputString is null', () => {
    const result = parseJsonToRequestListDigitalAddress(null);
    expect(result).toBeNull();
  });

  it('should return a parsed object for valid JSON string', () => {
    const result = parseJsonToRequestListDigitalAddress(validJsonString) as RequestListDigitalAddress;
    expect(result).toEqual(classToPlain(validObject) as RequestListDigitalAddress);
  });

  it('should log an error and return null for invalid JSON string', () => {
    const result = parseJsonToRequestListDigitalAddress(invalidJsonString);
    expect(result).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Errore durante il parsing della stringa JSON'));
  });
});

import { describe, it, expect, vi } from 'vitest';
import { classToPlain } from 'class-transformer';
import { logger } from 'pdnd-common';
import { ResponseRequestDigitalAddressModel } from 'pdnd-models';
import { parseJsonToResponseRequestDigitalAddress, parseJsonToResponseRequestDigitalAddressArray, convertStringToRichiesta } from "../../../src/utilities/jsonFiscalcodeUtilities.js";

// Mock data
const validJsonString = '{"codiceFiscale": "ABC123", "someField": "someValue", "digitalAddress": [{"digitalAddress": "address1", "practicedProfession": "profession1", "usageInfo": {"motivation": "motivation1", "dateEndValidity": "2024-12-31"}}]}';
const invalidJsonString = '{codiceFiscale: ABC123}';
const validArrayJsonString = '[{"codiceFiscale": "ABC123", "someField": "someValue", "digitalAddress": [{"digitalAddress": "address1", "practicedProfession": "profession1", "usageInfo": {"motivation": "motivation1", "dateEndValidity": "2024-12-31"}}]}]';

// Mock the logger
vi.mock('pdnd-common', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('parseJsonToResponseRequestDigitalAddress', () => {
  it('should return null if inputString is null', () => {
    const result = parseJsonToResponseRequestDigitalAddress(null);
    expect(result).toBeNull();
  });

  it('should return a parsed object for valid JSON string', () => {
    const result = parseJsonToResponseRequestDigitalAddress(validJsonString) as ResponseRequestDigitalAddressModel;
    expect(result).toEqual(classToPlain(JSON.parse(validJsonString)) as ResponseRequestDigitalAddressModel);
  });

  it('should log an error and return null for invalid JSON string', () => {
    const result = parseJsonToResponseRequestDigitalAddress(invalidJsonString);
    expect(result).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Errore durante il parsing della stringa JSON'));
  });
});

describe('parseJsonToResponseRequestDigitalAddressArray', () => {
  it('should return null if inputString is null', () => {
    const result = parseJsonToResponseRequestDigitalAddressArray(null);
    expect(result).toBeNull();
  });

  it('should return a parsed array for valid JSON string', () => {
    const result = parseJsonToResponseRequestDigitalAddressArray(validArrayJsonString) as ResponseRequestDigitalAddressModel[];
    expect(result).toEqual(JSON.parse(validArrayJsonString).map((item: any) => classToPlain(item) as ResponseRequestDigitalAddressModel));
  });

  it('should log an error and return null for invalid JSON string', () => {
    const result = parseJsonToResponseRequestDigitalAddressArray(invalidJsonString);
    expect(result).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Errore durante il parsing della stringa JSON'));
  });

  it('should throw an error if JSON does not represent an array', () => {
    const notArrayJsonString = '{"codiceFiscale": "ABC123", "someField": "someValue"}';
    const result = parseJsonToResponseRequestDigitalAddressArray(notArrayJsonString);
    expect(result).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Errore durante il parsing della stringa JSON'));
  });
});

describe('convertStringToRichiesta', () => {
  it('should return a parsed object for valid JSON string', () => {
    const result = convertStringToRichiesta(validJsonString);
    expect(result).toEqual({
      codiceFiscale: 'ABC123',
      since: undefined,
      digitalAddress: [
        {
          digitalAddress: 'address1',
          practicedProfession: 'profession1',
          usageInfo: {
            motivation: 'motivation1',
            dateEndValidity: '2024-12-31',
          },
        },
      ],
    });
  });

  it('should throw an error for invalid JSON string', () => {
    expect(() => convertStringToRichiesta(invalidJsonString)).toThrow(SyntaxError);
  });
});

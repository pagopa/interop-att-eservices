import { describe, it, expect } from 'vitest';
import { fiscalcodeNotFound } from '../../../src/exceptions/errors';
import {
  appendUniqueVerifyRequestToArray,
  findRequestlByIdRequest,
  deleteRequestByIdRequest,
} from '../../../src/utilities/verifyRequestUtilities.js';
import { VerifyRequest } from "../../../src/model/digitalAddress/VerifyRequest.js";

describe('appendUniqueVerifyRequestToArray', () => {
  it('should throw an error if existingArray or modelsToAdd are null or undefined', () => {
    expect(() => appendUniqueVerifyRequestToArray(null, null)).toThrowError(
      "L'array esistente e la lista dei modelli da aggiungere devono essere definiti."
    );
  });

  it('should add modelsToAdd to existingArray if not already present', () => {
    const existingArray: VerifyRequest[] = [{ idRequest: '1', jsonRequest: '{}' }];
    const modelsToAdd: VerifyRequest[] = [{ idRequest: '2', jsonRequest: '{}' }];

    const result = appendUniqueVerifyRequestToArray(existingArray, modelsToAdd);
    expect(result.length).toBe(2);
    expect(result).toContainEqual(modelsToAdd[0]);
  });

  it('should update existing models in existingArray if already present', () => {
    const existingArray: VerifyRequest[] = [{ idRequest: '1', jsonRequest: '{}' }];
    const modelsToAdd: VerifyRequest[] = [{ idRequest: '1', jsonRequest: '{"updated": true}' }];

    const result = appendUniqueVerifyRequestToArray(existingArray, modelsToAdd);
    expect(result.length).toBe(1);
    expect(result[0].jsonRequest).toBe('{"updated": true}');
  });
});

describe('findRequestlByIdRequest', () => {
  const mockVerifyRequests: VerifyRequest[] = [
    { idRequest: '1', jsonRequest: '{}' },
    { idRequest: '2', jsonRequest: '{}' },
  ];

  it('should return the verify request with the specified idRequest', () => {
    const result = findRequestlByIdRequest(mockVerifyRequests, '1');
    expect(result).toEqual(mockVerifyRequests[0]);
  });

  it('should return null if no verify request with the specified idRequest is found', () => {
    const result = findRequestlByIdRequest(mockVerifyRequests, '3');
    expect(result).toBeNull();
  });

  it('should return null if the input array is null', () => {
    const result = findRequestlByIdRequest(null, '1');
    expect(result).toBeNull();
  });
});

describe('deleteRequestByIdRequest', () => {
  const mockVerifyRequests: VerifyRequest[] = [
    { idRequest: '1', jsonRequest: '{}' },
    { idRequest: '2', jsonRequest: '{}' },
  ];

  it('should throw fiscalcodeNotFound error if existingArray is null', () => {
    expect(() => deleteRequestByIdRequest(null, '1')).toThrowError(fiscalcodeNotFound().message);
  });

  it('should remove the verify request with the specified idRequest', () => {
    const result = deleteRequestByIdRequest(mockVerifyRequests, '1');
    expect(result.length).toBe(1);
    expect(result).not.toContainEqual({ idRequest: '1', jsonRequest: '{}' });
  });

  it('should return the same array if no verify request with the specified idRequest is found', () => {
    const result = deleteRequestByIdRequest(mockVerifyRequests, '3');
    expect(result).toEqual(mockVerifyRequests);
  });

  it('should return an empty array if the input array is empty', () => {
    const result = deleteRequestByIdRequest([], '1');
    expect(result).toEqual([]);
  });
});

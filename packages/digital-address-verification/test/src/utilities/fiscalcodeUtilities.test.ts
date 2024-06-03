import { describe, it, expect } from 'vitest';
import { ResponseRequestDigitalAddressModel } from 'pdnd-models';
import {
    appendUniqueFiscalcodeModelsToArray,
    // areFiscalCodesValid,
    deleteFiscalcodeModelByFiscaldode,
    findFiscalcodeModelByFiscalcode,
  } from "../../../src/utilities/fiscalcodeUtilities.js";
  
//import { fiscalcodeNotFound } from '../../../src/exceptions/errors';

// Mock data
const mockData: ResponseRequestDigitalAddressModel[] = [
    {
        "codiceFiscale": "RRANGL74M28R701A",
        "since": "2017-07-21T17:32:28Z",
        "digitalAddress": [
          {
            "digitalAddress": "example@pec.it",
            "practicedProfession": "AVVOCATO",
            "usageInfo": {
              "motivation": "CESSAZIONE_VOLONTARIA",
              "dateEndValidity": "2017-07-21T17:32:28Z"
            }
          }
        ]
      },
      {
        "codiceFiscale": "RRANGL74M28R701B",
        "since": "2017-07-21T17:32:28Z",
        "digitalAddress": [
          {
            "digitalAddress": "example@pec.it",
            "practicedProfession": "AVVOCATO",
            "usageInfo": {
              "motivation": "CESSAZIONE_VOLONTARIA",
              "dateEndValidity": "2017-07-21T17:32:28Z"
            }
          }
        ]
      }];

// Test for appendUniqueFiscalcodeModelsToArray
describe('appendUniqueFiscalcodeModelsToArray', () => {
  it('should throw an error if existingArray or modelsToAdd are null', () => {
    expect(() => appendUniqueFiscalcodeModelsToArray(null, mockData)).toThrow(Error);
    expect(() => appendUniqueFiscalcodeModelsToArray(mockData, null)).toThrow(Error);
  });
});

// Test for findFiscalcodeModelByFiscalcode
describe('findFiscalcodeModelByFiscalcode', () => {
  it('should return null if fiscalCodes is null', () => {
    const result = findFiscalcodeModelByFiscalcode(null, 'RRANGL74M28R701A');
    expect(result).toBeNull();
  });

  it('should return null if the model is not found', () => {
    const result = findFiscalcodeModelByFiscalcode(mockData, 'XYZ000');
    expect(result).toBeNull();
  });
});

// Test for deleteFiscalcodeModelByFiscaldode
describe('deleteFiscalcodeModelByFiscaldode', () => {

  it('should delete the correct model', () => {
    const result = deleteFiscalcodeModelByFiscaldode(mockData, 'RRANGL74M28R701A');
    expect(result).toHaveLength(1);
    expect(result?.find(model => model.codiceFiscale === 'RRANGL74M28R701A')).toBeUndefined();
  });

  it('should return the original array if the model is not found', () => {
    const result = deleteFiscalcodeModelByFiscaldode(mockData, 'XYZ000');
    expect(result).toHaveLength(2);
  });
});

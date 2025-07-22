import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import { digitalAddressService } from "pdnd-common";
import type { RequestListDigitalAddress } from "../src/model/domain/models.js";

import {
  requestParamNotValid,
  requestVerificationNotFountError,
} from "../src/exceptions/errors.js";
import { getMaxNumber } from "../src/utilities/statusRequestUtility.js";
import { parseJsonToRequestListDigitalAddress } from "../src/utilities/jsonDigitalAddressUtilities.js";
import { responseRequestDigitalAddressModelToResponseRequestDigitalAddress } from "../src/model/domain/apiConverter.js";
import { calculateUpdatedRequestState } from "../src/utilities/simulationUtils.js";

vi.mock("pdnd-common", async () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
  getContext: vi.fn(),
  digitalAddress: {
    saveVerificationRequest: vi.fn(),
    findVerificationRequestById: vi.fn(),
    updateVerificationRequest: vi.fn(),
    findSingleDataPreparationByFiscalCode: vi.fn(),
  },
}));

vi.mock("../src/exceptions/errors.js", async () => ({
  requestParamNotValid: vi.fn((msg) => new Error(msg)),
  requestVerificationNotFountError: vi.fn((msg) => new Error(msg)),
}));

vi.mock("../src/utilities/statusRequestUtility.js", async () => ({
  getMaxNumber: vi.fn(),
  getStatusFromNumber: vi.fn((num) => `STATUS_${num}`),
}));

vi.mock("../src/utilities/jsonDigitalAddressUtilities.js", async () => ({
  parseJsonToRequestListDigitalAddress: vi.fn(),
}));

vi.mock("../src/model/domain/apiConverter.js", async () => ({
  responseRequestDigitalAddressModelToResponseRequestDigitalAddress: vi.fn(),
}));

vi.mock("../src/utilities/simulationUtils.js", async () => ({
  calculateUpdatedRequestState: vi.fn(),
}));

// FIX: Il mock è ora autonomo e non dipende da variabili esterne.
vi.mock("../src/model/digitalAddress/VerifyRequest.js", async () => ({
  VerifyRequest: vi.fn(() => ({
    idRequest: "mock-uuid",
    jsonRequest: "{}",
    count: 1,
  })),
}));

// FIX: Importa la classe mockata e il controller DOPO tutte le chiamate vi.mock.
import { VerifyRequest } from "../src/model/digitalAddress/VerifyRequest.js";
import controller from "../src/controllers/digitalAddressVerificationMultipleController.js";

describe("DigitalAddressVerificationSingleController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("saveRequest", () => {
    it("should save a valid request and return a response", async () => {
      const request: RequestListDigitalAddress = {
        idRequest: "mock-uuid",
        idSubjects: ["CODE1"],
      };
      (getMaxNumber as Mock).mockReturnValue(3);
      (digitalAddressService.saveVerificationRequest as Mock).mockResolvedValue(
        undefined
      );

      const result = await controller.saveRequest(request);
      const mockInstance = (VerifyRequest as Mock).mock.results[0].value;

      expect(getMaxNumber).toHaveBeenCalledOnce();
      // FIX: Usa la classe mockata importata per l'asserzione.
      expect(VerifyRequest).toHaveBeenCalledWith(
        request.idRequest,
        JSON.stringify(request),
        3
      );
      expect(
        digitalAddressService.saveVerificationRequest
      ).toHaveBeenCalledWith(mockInstance);
      expect(result.state).toBe("STATUS_3");
      expect(result.id).toBe(request.idRequest);
    });

    it("should throw an error for a request without idSubjects", async () => {
      const request = { idRequest: "mock-uuid" } as RequestListDigitalAddress;
      const errorMsg =
        "The request body has one or more required param not valid";

      await expect(controller.saveRequest(request)).rejects.toThrow(errorMsg);
      expect(requestParamNotValid).toHaveBeenCalledWith(errorMsg);
    });
  });

  describe("verify", () => {
    it("should update the request state if it has changed", async () => {
      const idRichiesta = "req-123";
      const originalRequest = { count: 2 };
      const finalRequestState = { count: 1 };

      (
        digitalAddressService.findVerificationRequestById as Mock
      ).mockResolvedValue(originalRequest);
      (calculateUpdatedRequestState as Mock).mockReturnValue(finalRequestState);

      const result = await controller.verify(idRichiesta);

      expect(
        digitalAddressService.updateVerificationRequest
      ).toHaveBeenCalledWith(finalRequestState);
      expect(result.status).toBe("STATUS_1");
    });

    it("should not update the request state if it has not changed", async () => {
      const idRichiesta = "req-123";
      const originalRequest = { count: 1 };

      (
        digitalAddressService.findVerificationRequestById as Mock
      ).mockResolvedValue(originalRequest);
      (calculateUpdatedRequestState as Mock).mockReturnValue(originalRequest);

      const result = await controller.verify(idRichiesta);

      expect(
        digitalAddressService.updateVerificationRequest
      ).not.toHaveBeenCalled();
      expect(result.status).toBe("STATUS_1");
    });

    it("should throw an error if the original request is not found", async () => {
      const idRichiesta = "req-not-found";
      (
        digitalAddressService.findVerificationRequestById as Mock
      ).mockResolvedValue(null);

      await expect(controller.verify(idRichiesta)).rejects.toThrow(
        `The request verification not found with id: ${idRichiesta}`
      );
      expect(requestVerificationNotFountError).toHaveBeenCalled();
    });
  });

  describe("getByIdRequest", () => {
    it("should return a list of addresses if request count is 1", async () => {
      const idRichiesta = "req-123";
      const mockRequest = { count: 1, jsonRequest: "{}" };
      const mockParsedRequest = { idSubjects: ["CODE1", "CODE2"] };
      const mockAddressModel1 = { fiscalCode: "CODE1" };
      const mockAddressModel2 = { fiscalCode: "CODE2" };
      const mockConvertedAddress = { cf: "CODE1" };

      (
        digitalAddressService.findVerificationRequestById as Mock
      ).mockResolvedValue(mockRequest);
      (parseJsonToRequestListDigitalAddress as Mock).mockReturnValue(
        mockParsedRequest
      );
      (digitalAddressService.findSingleDataPreparationByFiscalCode as Mock)
        .mockResolvedValueOnce(mockAddressModel1)
        .mockResolvedValueOnce(mockAddressModel2);
      (
        responseRequestDigitalAddressModelToResponseRequestDigitalAddress as Mock
      ).mockReturnValue(mockConvertedAddress);

      const result = await controller.getByIdRequest(idRichiesta);

      expect(
        digitalAddressService.findSingleDataPreparationByFiscalCode
      ).toHaveBeenCalledTimes(2);
      expect(result.list).toHaveLength(2);
      expect(result.list[0]).toEqual(mockConvertedAddress);
    });

    it("should throw an error if request count is not 1", async () => {
      const idRichiesta = "req-123";
      const mockRequest = { count: 0 };
      (
        digitalAddressService.findVerificationRequestById as Mock
      ).mockResolvedValue(mockRequest);

      await expect(controller.getByIdRequest(idRichiesta)).rejects.toThrow(
        `The request verification not found with id: ${idRichiesta}`
      );
    });

    it("should throw an error if request is not found", async () => {
      const idRichiesta = "req-not-found";
      (
        digitalAddressService.findVerificationRequestById as Mock
      ).mockResolvedValue(null);

      await expect(controller.getByIdRequest(idRichiesta)).rejects.toThrow(
        `The request verification not found with id: ${idRichiesta}`
      );
    });
  });
});

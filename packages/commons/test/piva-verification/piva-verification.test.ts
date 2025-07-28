// TODO: da implementare

// import { describe, it, expect, vi, afterEach } from "vitest";

// const mockPivaRepository = {
//   getPivaObjectByKey: vi.fn(),
//   setPivaObject: vi.fn(),
//   getAllPivaObject: vi.fn(),
//   deleteAllPivaObject: vi.fn(),
//   deletePivaObjectByKey: vi.fn(),
// };

// vi.mock("../../repositories/piva-verification/piva.js", () => ({
//   PivaRepository: vi.fn().mockImplementation(() => mockPivaRepository),
// }));

// vi.mock("pdnd-common", () => ({
//   logger: {
//     info: vi.fn(),
//     error: vi.fn(),
//   },
// }));

// import PivaVerificationService from "../../services/piva-verification/pivaService.js";

// const testModel = { organizationId: "ORG123456" };
// const existingModel = { organizationId: "EXISTING123" };
// const testResultList = [{ organizationId: "ORG1" }, { organizationId: "ORG2" }];

// describe("PivaVerificationService", () => {
//   afterEach(() => {
//     vi.clearAllMocks();
//   });

//   describe("saveList", () => {
//     it("dovrebbe salvare l'organizationId se non esiste", async () => {
//       mockPivaRepository.getPivaObjectByKey.mockResolvedValueOnce(null);

//       const result = await PivaVerificationService.saveList(testModel);

//       expect(mockPivaRepository.getPivaObjectByKey).toHaveBeenCalledWith(
//         testModel.organizationId
//       );
//       expect(mockPivaRepository.setPivaObject).toHaveBeenCalledWith(
//         testModel.organizationId
//       );
//       expect(result).toEqual(testModel);
//     });

//     it("non dovrebbe salvare l'organizationId se esiste già", async () => {
//       mockPivaRepository.getPivaObjectByKey.mockResolvedValueOnce(
//         existingModel
//       );

//       const result = await PivaVerificationService.saveList(existingModel);

//       expect(mockPivaRepository.getPivaObjectByKey).toHaveBeenCalledWith(
//         existingModel.organizationId
//       );
//       expect(mockPivaRepository.setPivaObject).not.toHaveBeenCalled();
//       expect(result).toBeNull();
//     });
//   });

//   describe("getAll", () => {
//     it("dovrebbe restituire tutti gli oggetti salvati", async () => {
//       mockPivaRepository.getAllPivaObject.mockResolvedValueOnce(testResultList);

//       const result = await PivaVerificationService.getAll();

//       expect(mockPivaRepository.getAllPivaObject).toHaveBeenCalled();
//       expect(result).toEqual(testResultList);
//     });
//   });

//   describe("deleteByPiva", () => {
//     it("dovrebbe eliminare un oggetto tramite la sua chiave (organizationId)", async () => {
//       mockPivaRepository.deletePivaObjectByKey.mockResolvedValueOnce(undefined);

//       const result = await PivaVerificationService.deleteByPiva(testModel);

//       expect(mockPivaRepository.deletePivaObjectByKey).toHaveBeenCalledWith(
//         testModel.organizationId
//       );
//       expect(result).toEqual(testModel);
//     });
//   });

//   describe("deleteAllByKey", () => {
//     it("dovrebbe eliminare tutti i record", async () => {
//       mockPivaRepository.deleteAllPivaObject.mockResolvedValueOnce(undefined);

//       await PivaVerificationService.deleteAllByKey();

//       expect(mockPivaRepository.deleteAllPivaObject).toHaveBeenCalled();
//     });
//   });
// });

import { describe, it, expect, vi, beforeEach } from 'vitest';
import dataPreparationRepository from '../../../src/repository/dataPreparationRepository';
import { logger, cacheManager } from 'pdnd-common';
import { parseJsonToUserArray } from '../../../src/utilities/jsonUserUtilities';
import { getUserModelByCodiceFiscale } from '../../../src/utilities/userUtilities';
import { FiscalcodeModel } from 'pdnd-models';

// Mock delle dipendenze
vi.mock('pdnd-common', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn()
  },
  cacheManager: {
    setObject: vi.fn(),
    getObjectByKey: vi.fn(),
    deleteAllObjectByKey: vi.fn()
  }
}));

vi.mock('../../../src/utilities/jsonFiscalcodeUtilities', () => ({
  parseJsonToUserArray: vi.fn()
}));


vi.mock('../../../src/utilities/fiscalcodeUtilities', () => ({
  getUserModelByCodiceFiscale: vi.fn()
}));

describe('dataPreparationRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('saveList', () => {
    it('should save the list and return the saved object', async () => {
      const mockRequest: FiscalcodeModel[] = [{ fiscalCode: 'bccccc44r61w122q' }];
      const mockKey = 'testKey';
      const mockSavedData = JSON.stringify(mockRequest);

      (cacheManager.setObject as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      (cacheManager.getObjectByKey as ReturnType<typeof vi.fn>).mockResolvedValue(mockSavedData);

      const result = await dataPreparationRepository.saveList(mockRequest, mockKey);

      expect(cacheManager.setObject).toHaveBeenCalledWith(mockKey, mockSavedData);
      expect(cacheManager.getObjectByKey).toHaveBeenCalledWith(mockKey);
      expect(logger.info).toHaveBeenCalledWith('dataPreparationRepository: Elemento salvato con successo.');
      expect(result).toBe(mockSavedData);
    });

   /* it('should log an error and throw it if saving fails', async () => {
      const mockRequest: FiscalcodeModel[] = [{ fiscalCode: 'bccccc44r61w122q' }];
      const mockKey = 'testKey';
      const mockError = new Error('Test error');

      (cacheManager.setObject as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(dataPreparationRepository.saveList(mockRequest, mockKey)).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith('dataPreparationRepository: Errore durante il salvataggio del\' elemento: ', mockError);
    });*/
  });

 /* describe('findAllByKey', () => {
    it('should retrieve and parse the saved object', async () => {
      const mockKey = 'testKey';
      const mockSavedData = '[{ fiscalCode: bccccc44r61w122 }]';
      const mockParsedData: FiscalcodeModel[] = [{ fiscalCode: 'bccccc44r61w122q' }];

      (cacheManager.getObjectByKey as ReturnType<typeof vi.fn>).mockResolvedValue(mockSavedData);
      (parseJsonToUserArray as ReturnType<typeof vi.fn>).mockReturnValue(mockParsedData);

      const result = await dataPreparationRepository.findAllByKey(mockKey);

      expect(cacheManager.getObjectByKey).toHaveBeenCalledWith(mockKey);
      expect(parseJsonToUserArray).toHaveBeenCalledWith(mockSavedData);
      expect(logger.info).toHaveBeenCalledWith('dataPreparationRepository: Elemento recuperato con successo.');
      expect(result).toBe(mockParsedData);
    });

    it('should log an error and throw it if retrieval fails', async () => {
      const mockKey = 'testKey';
      const mockError = new Error('Test error');

      (cacheManager.getObjectByKey as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(dataPreparationRepository.findAllByKey(mockKey)).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith('userRepository: Errore durante il recupero dell\'elemento: ', mockError);
    });
  });*/

  /*describe('findByPurposeId', () => {
    it('should retrieve and find the fiscal code', async () => {
      const mockKey = 'testKey';
      const mockFiscalCode = 'bccccc44r61w122q';
      const mockSavedData = '[{ fiscalCode: bccccc44r61w122q }]';
      const mockParsedData: FiscalcodeModel[] = [{ fiscalCode: 'bccccc44r61w122q' }];
      const mockFoundData: FiscalcodeModel = { fiscalCode: 'bccccc44r61w122q' };

      (cacheManager.getObjectByKey as ReturnType<typeof vi.fn>).mockResolvedValue(mockSavedData);
      (parseJsonToUserArray as ReturnType<typeof vi.fn>).mockReturnValue(mockParsedData);
      (getUserModelByCodiceFiscale as ReturnType<typeof vi.fn>).mockReturnValue(mockFoundData);

      const result = await dataPreparationRepository.findAllByUuid(mockKey, mockFiscalCode);

      expect(cacheManager.getObjectByKey).toHaveBeenCalledWith(mockKey);
      expect(parseJsonToUserArray).toHaveBeenCalledWith(mockSavedData);
      expect(getUserModelByCodiceFiscale).toHaveBeenCalledWith(mockParsedData, mockFiscalCode);
      expect(logger.info).toHaveBeenCalledWith('dataPreparationRepository: Elemento recuperato con successo.');
      expect(result).toBe(mockFoundData);
    });

    it('should log an error and throw it if retrieval fails', async () => {
      const mockKey = 'testKey';
      const mockFiscalCode = 'testFiscalCode';
      const mockError = new Error('Test error');

      (cacheManager.getObjectByKey as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(dataPreparationRepository.findByPurposeId(mockKey, mockFiscalCode)).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith('userRepository: Errore durante il recupero dell\'elemento: ', mockError);
    });
  });*/

  /*describe('deleteAllByKey', () => {
    it('should delete the object and return the length of deleted items', async () => {
      const mockKey = 'testKey';
      const mockSavedData = null;

      (cacheManager.deleteAllObjectByKey as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      (cacheManager.getObjectByKey as ReturnType<typeof vi.fn>).mockResolvedValue(mockSavedData);
      (parseJsonToUserArray as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const result = await dataPreparationRepository.deleteAllByKey(mockKey);

      expect(cacheManager.deleteAllObjectByKey).toHaveBeenCalledWith(mockKey);
      expect(cacheManager.getObjectByKey).toHaveBeenCalledWith(mockKey);
      expect(parseJsonToUserArray).toHaveBeenCalledWith(mockSavedData);
      expect(result).toBe(0);
    });

    it('should log an error and throw it if deletion fails', async () => {
      const mockKey = 'testKey';
      const mockError = new Error('Test error');

      (cacheManager.deleteAllObjectByKey as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(dataPreparationRepository.deleteAllByKey(mockKey)).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith('userRepository: Errore durante il recupero dell\'elemento: ', mockError);
    });
  });*/
});

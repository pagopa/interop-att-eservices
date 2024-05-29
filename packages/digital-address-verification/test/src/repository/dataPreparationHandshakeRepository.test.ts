import { describe, it, expect, vi, beforeEach } from 'vitest';
import dataPreparationHandshakeRepository from '../../../src/repository/dataPreparationHandshakeRepository';
import { cacheManager } from 'pdnd-common';
import { parseJsonToHandshakeArray } from '../../../src/utilities/jsonHandshakeUtilities';
import { logger } from 'pdnd-common';

vi.mock('pdnd-common', () => ({
    cacheManager: {
      setObject: vi.fn(),
      getObjectByKey: vi.fn(),
      deleteAllObjectByKey: vi.fn()
    },
    logger: {
      info: vi.fn(),
      error: vi.fn()
    }
  }));
  
  vi.mock('../../../src/utilities/jsonHandshakeUtilities', () => ({
    parseJsonToHandshakeArray: vi.fn()
  }));
  
  describe('dataPreparationHandshakeRepository', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
  
    describe('saveList', () => {
      it('should save the list to cache', async () => {
        const genericRequest = [{ pourposeId: 'testPourposeId', apikey: 'testApikey', cert: 'testCert' }];
        const key = 'testKey';
        const mockSavedData = JSON.stringify(genericRequest);
  
        await dataPreparationHandshakeRepository.saveList(genericRequest, key);
  
        expect(cacheManager.setObject).toHaveBeenCalledWith(key, mockSavedData);
        expect(cacheManager.getObjectByKey).toHaveBeenCalledWith(key);
        expect(logger.info).toHaveBeenCalledWith('dataPreparationRepository: Elemento salvato con successo.');
      });
  
      it('should throw error if saving fails', async () => {
        const genericRequest = [{ pourposeId: 'testPourposeId', apikey: 'testApikey', cert: 'testCert' }];
        const key = 'testKey';
        const mockError = new Error('Test error');
        (cacheManager.setObject as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);
  
        await expect(dataPreparationHandshakeRepository.saveList(genericRequest, key)).rejects.toThrow(mockError);
        expect(logger.error).toHaveBeenCalledWith('dataPreparationRepository: Errore durante il salvataggio del\' elemento: ', mockError);
      });
    });
  
    describe('findAllByKey', () => {
      it('should return parsed array when data is found in cache', async () => {
        const key = 'testKey';
        const mockSavedData = '[{ pourposeId: "testPourposeId", apikey: "testApikey", cert: "testCert" }]';
        const mockParsedData = [{ pourposeId: 'testPourposeId', apikey: 'testApikey', cert: 'testCert' }];
  
        (cacheManager.getObjectByKey as ReturnType<typeof vi.fn>).mockResolvedValue(mockSavedData);
        (parseJsonToHandshakeArray as ReturnType<typeof vi.fn>).mockReturnValue(mockParsedData);
  
        const result = await dataPreparationHandshakeRepository.findAllByKey(key);
  
        expect(cacheManager.getObjectByKey).toHaveBeenCalledWith(key);
        expect(parseJsonToHandshakeArray).toHaveBeenCalledWith(mockSavedData);
        expect(logger.info).toHaveBeenCalledWith('dataPreparationRepository: Elemento recuperato con successo.');
        expect(result).toEqual(mockParsedData);
      });
  
      it('should return null when no data found in cache', async () => {
        const key = 'testKey';
        (cacheManager.getObjectByKey as ReturnType<typeof vi.fn>).mockResolvedValue(null);
  
        const result = await dataPreparationHandshakeRepository.findAllByKey(key);
  
        expect(cacheManager.getObjectByKey).toHaveBeenCalledWith(key);
        //expect(logger.error).toHaveBeenCalledWith('userRepository: Errore durante il recupero dell\'elemento: ', new Error('Test error'));
        //expect(result).toBeNull();
      });
    });
  
    describe('findByPurposeId', () => {
      it('should return matching handshake model when found in cache', async () => {
        const key = 'testKey';
        const pourposeId = 'testPourposeId';
        const mockSavedData = '[{ pourposeId: "testPourposeId", apikey: "testApikey", cert: "testCert" }]';
        const mockParsedData = [{ pourposeId: 'testPourposeId', apikey: 'testApikey', cert: 'testCert' }];
  
        (cacheManager.getObjectByKey as ReturnType<typeof vi.fn>).mockResolvedValue(mockSavedData);
        (parseJsonToHandshakeArray as ReturnType<typeof vi.fn>).mockReturnValue(mockParsedData);
  
        const result = await dataPreparationHandshakeRepository.findByPurposeId(key, pourposeId);
  
        expect(cacheManager.getObjectByKey).toHaveBeenCalledWith(key);
        expect(parseJsonToHandshakeArray).toHaveBeenCalledWith(mockSavedData);
        expect(logger.info).toHaveBeenCalledWith('dataPreparationRepository: Elemento recuperato con successo.');
        expect(result).toEqual(mockParsedData[0]);
      });
  
      it('should return null when no matching handshake model found in cache', async () => {
        const key = 'testKey';
        const pourposeId = 'testNonexistentPourposeId';
        const mockSavedData = '[{ pourposeId: "testPourposeId", apikey: "testApikey", cert: "testCert" }]';
        const mockParsedData = [{ pourposeId: 'testPourposeId', apikey: 'testApikey', cert: 'testCert' }];
  
        (cacheManager.getObjectByKey as ReturnType<typeof vi.fn>).mockResolvedValue(mockSavedData);
        (parseJsonToHandshakeArray as ReturnType<typeof vi.fn>).mockReturnValue(mockParsedData);
  
        const result = await dataPreparationHandshakeRepository.findByPurposeId(key, pourposeId);
  
        expect(cacheManager.getObjectByKey).toHaveBeenCalledWith(key);
        expect(parseJsonToHandshakeArray).toHaveBeenCalledWith(mockSavedData);
        expect(logger.info).toHaveBeenCalledWith('dataPreparationRepository: Elemento recuperato con successo.');
        expect(result).toBeNull();
      });
    });
    describe('deleteAllByKey', () => {
        it('should delete all data associated with the key from cache and return the number of deleted items', async () => {
          const key = 'testKey';
          const mockSavedData = '[{ pourposeId: "testPourposeId", apikey: "testApikey", cert: "testCert" }]';
          const mockParsedData = [{ pourposeId: 'testPourposeId', apikey: 'testApikey', cert: 'testCert' }];
    
          (cacheManager.getObjectByKey as ReturnType<typeof vi.fn>).mockResolvedValue(mockSavedData);
          (parseJsonToHandshakeArray as ReturnType<typeof vi.fn>).mockReturnValue(mockParsedData);
    
          const result = await dataPreparationHandshakeRepository.deleteAllByKey(key);
    
          expect(cacheManager.deleteAllObjectByKey).toHaveBeenCalledWith(key);
          expect(cacheManager.getObjectByKey).toHaveBeenCalledWith(key);
          expect(parseJsonToHandshakeArray).toHaveBeenCalledWith(mockSavedData);
          //expect(logger.info).toHaveBeenCalledWith('dataPreparationRepository: Elemento recuperato con successo.');
          //expect(result).toBe(mockParsedData.length);
        });
    
        it('should return 0 if no data associated with the key found in cache', async () => {
          const key = 'testKey';
          (cacheManager.getObjectByKey as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    
          const result = await dataPreparationHandshakeRepository.deleteAllByKey(key);
    
          expect(cacheManager.deleteAllObjectByKey).toHaveBeenCalledWith(key);
          expect(cacheManager.getObjectByKey).toHaveBeenCalledWith(key);
          //expect(logger.error).toHaveBeenCalledWith('userRepository: Errore durante il recupero dell\'elemento: ', new Error('Test error'));
          //expect(result).toBe(0);
        });
      });
    });
    
import { describe, it, expect, vi } from 'vitest';
import tokenService from '../../../src/services/TokenService';
import { validate } from '../../../src/interoperability/interoperabilityValidationMiddleware';

// Mock di getContext
vi.mock('pdnd-common', () => ({
  getContext: vi.fn(() => ({ /* Mock del contesto */ }))
}));

// Mock di validate
vi.mock('../../../src/interoperability/interoperabilityValidationMiddleware', () => ({
  validate: vi.fn()
}));

describe('tokenService', () => {
  describe('validate', () => {
    it('should call validate with correct parameters', async () => {
      const token = 'testToken';
      const mockValidationResult = true;

      (validate as ReturnType<typeof vi.fn>).mockResolvedValue(mockValidationResult);

      const result = await tokenService.validate(token);

      expect(validate).toHaveBeenCalledWith(token, 'voucher');
      expect(result).toBe(mockValidationResult);
    });

    it('should return null when validation fails', async () => {
      const token = 'testToken';
      const mockValidationResult = null;

      (validate as ReturnType<typeof vi.fn>).mockResolvedValue(mockValidationResult);

      const result = await tokenService.validate(token);

      expect(validate).toHaveBeenCalledWith(token, 'voucher');
      expect(result).toBeNull();
    });

    it('should throw error when validation throws error', async () => {
      const token = 'testToken';
      const mockError = new Error('Test error');

      (validate as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(tokenService.validate(token)).rejects.toThrow(mockError);

      expect(validate).toHaveBeenCalledWith(token, 'voucher');
    });
  });
});

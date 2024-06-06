import { describe, it, expect, vi } from 'vitest';
import { ErrorHandling } from 'pdnd-models';
import jose from 'node-jose';
import { logger } from 'pdnd-common';
import { decodePublicKey, generateRSAPublicKey, verify } from '../../../src/utilities/rsaUtility';

// Mock the logger
vi.mock('pdnd-common', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

const mockPublicKey = new Uint8Array([65, 66, 67]); // Replace with a valid key for actual testing
const mockJWK = {
  kty: 'RSA',
  e: 'AQAB',
  n: '0vx7agoebGcQSuuPiLJXZptN7y0h8NuAMvPQ6Nd2GEKv6b8mhrwC5L4y9Tr7ea3JlwwhEUI0Msbw4EgxWvDJpA==',
  alg: 'RS256',
  kid: '2011-04-29',
};
const mockToken = 'your.mock.token'; // Replace with a valid token for actual testing

describe('decodePublicKey', () => {
  it('should throw an error if publicKey is null', async () => {
    await expect(decodePublicKey(null)).rejects.toThrow('Error: public key not valid');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error decode public key'));
  });

  /*it('should return a JWK key for a valid public key', async () => {
    const key = await decodePublicKey(mockPublicKey);
    expect(key).toBeDefined();
    expect(logger.info).toHaveBeenCalledWith('publicKeyService: decodePublicKey done');
  });*/

  it('should log an error and throw an error for an invalid public key', async () => {
    const invalidPublicKey = new Uint8Array([1, 2, 3]);
    await expect(decodePublicKey(invalidPublicKey)).rejects.toThrow();
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error decode public key'));
  });
});

describe('generateRSAPublicKey', () => {
  it('should return a JWK key for a valid JWK object', async () => {
    const key = await generateRSAPublicKey(mockJWK as any);
    expect(key).toBeDefined();
    expect(logger.info).toHaveBeenCalledWith('generateRSAPublicKey: done');
  });

  it('should log an error and throw an error for an invalid JWK object', async () => {
    const invalidJWK = { kty: 'invalid' };
    await expect(generateRSAPublicKey(invalidJWK as any)).rejects.toThrow();
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error decode public key'));
  });
});

describe('verify', () => {
  /*it('should return true for a valid token', async () => {
    const key = await generateRSAPublicKey(mockJWK as any);
    const result = await verify(key, mockToken);
    expect(result).toBe(true);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('La firma del token è valida'));
  });*/

  it('should return false for an invalid token', async () => {
    const key = await generateRSAPublicKey(mockJWK as any);
    const invalidToken = 'invalid.token';
    const result = await verify(key, invalidToken);
    expect(result).toBe(false);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Errore durante la verifica del token'));
  });
});

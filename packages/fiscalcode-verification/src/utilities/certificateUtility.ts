
import crypto from 'crypto';

export function createCertificateHash(buffer: Buffer): string {
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    return hash.digest('hex');
  }
  
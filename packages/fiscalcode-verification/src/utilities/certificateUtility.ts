import { logger } from "pdnd-common";
import { X509 } from 'jsrsasign';

export function getCertificateFingerprintFromBuffer(buffer: Buffer): string {
  const cert: string = buffer.toString('utf8');

  // Converte il certificato pulito in formato URL-encoded
  const encodedCert = encodeURIComponent(cert);
  logger.info ("encodedCert: " + encodedCert);
  logger.info ("serial number: " + getSerialNumber(cert));

  return getSerialNumber(cert);
  //return getCertificateFingerprintFromString(encodedCert)
}

export function getCertificateFingerprintFromString(certString: string): string {
  logger.info ("encodedCert: " + certString);
  logger.info ("serial number: " + getSerialNumber(certString));
  // Rimuovi i delimitatori e unisci le linee del certificato
  return getSerialNumber(certString);
  /*const certBody = certString
    .replace(/-----BEGIN CERTIFICATE-----/, '')
    .replace(/-----END CERTIFICATE-----/, '')
    .replace(/\s+/g, '') // Rimuove gli spazi bianchi e le nuove linee
    .trim();

  // Converte il certificato in un Buffer
  const certBuffer = Buffer.from(certBody, 'utf8');

  // Calcola l'hash SHA-256 del Buffer
  const hash = crypto.createHash('sha256');
  hash.update(certBuffer);
  return hash.digest('hex');*/
}


// Funzione per estrarre il numero di serie di un certificato
export function getSerialNumber(cert: string): string {
  const x509 = new X509();
  x509.readCertPEM(cert);
  return x509.getSerialNumberHex();
}


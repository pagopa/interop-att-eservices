import crypto from "crypto";

export function getCertificateFingerprintFromBuffer(buffer: Buffer): string {
  const cert: string = buffer.toString('base64');

  // Converte il certificato pulito in formato URL-encoded
  const encodedCert = encodeURIComponent(cert);

  // Aggiunge i delimitatori e le nuove linee formattate correttamente
  const encode: string =  `-----BEGIN%20CERTIFICATE-----%0A${encodedCert}%0A-----END%20CERTIFICATE-----%0A`;
  return getCertificateFingerprintFromString(encode)
}

export function getCertificateFingerprintFromString(certString: string): string {
  // Rimuovi i delimitatori e unisci le linee del certificato
  const certBody = certString
    .replace(/-----BEGIN CERTIFICATE-----/, '')
    .replace(/-----END CERTIFICATE-----/, '')
    .replace(/\s+/g, '') // Rimuove gli spazi bianchi e le nuove linee
    .trim();

  // Converte il certificato in un Buffer
  const certBuffer = Buffer.from(certBody, 'base64');

  // Calcola l'hash SHA-256 del Buffer
  const hash = crypto.createHash('sha256');
  hash.update(certBuffer);
  return hash.digest('hex');
}
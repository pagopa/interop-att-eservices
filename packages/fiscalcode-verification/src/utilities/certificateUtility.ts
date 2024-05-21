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



// Funzione per estrarre il numero di serie di un certificato
export function getSerialNumber(cert: string): string {
  const x509 = new X509();
  x509.readCertPEM(cert);
  return x509.getSerialNumberHex();
}

/**
 * Converte un certificato URL-encoded in formato PEM e ne estrae il numero di serie.
 * @param {string} urlEncodedCert - Il certificato URL-encoded.
 * @returns {string} - Il numero di serie del certificato.
 */
export function getSerialNumberFromUrlEncodedCert(urlEncodedCert: string): string {
  // Decodifica il certificato URL-encoded
  const decodedCert = decodeURIComponent(urlEncodedCert);
  
  // Estrae il contenuto del certificato rimuovendo i delimitatori PEM
  const pemCert = decodedCert
    .replace('-----BEGIN CERTIFICATE-----', '')
    .replace('-----END CERTIFICATE-----', '')
    .replace(/\s+/g, ''); // Rimuove spazi e line breaks

  // Aggiunge i delimitatori PEM con ritorni a capo corretti
  const formattedPemCert = `-----BEGIN CERTIFICATE-----\n${pemCert.match(/.{1,64}/g)?.join('\n')}\n-----END CERTIFICATE-----`;

  // Crea un oggetto X509 dalla stringa PEM
  const x509 = new X509();
  x509.readCertPEM(formattedPemCert);

  // Ottiene il numero di serie del certificato
  const serialNumber = x509.getSerialNumberHex();

  return serialNumber;
}
import { logger } from "pdnd-common";
import { X509 } from "jsrsasign";

export function getCertificateFingerprintFromBuffer(buffer: Buffer): string {
  const cert: string = buffer.toString("utf8");

  const encodedCert = encodeURIComponent(cert);
  logger.info("encodedCert: " + encodedCert);
  logger.info("serial number: " + getSerialNumber(cert));

  return getSerialNumber(cert);
}

export function getSerialNumber(cert: string): string {
  const x509 = new X509();
  x509.readCertPEM(cert);
  return x509.getSerialNumberHex();
}

/**
 * Converts a URL-encoded certificate to PEM format and extracts its serial number.
 *
 * @param {string} urlEncodedCert - The URL-encoded certificate.
 * @returns {string} - The serial number
 * */
export function getSerialNumberFromUrlEncodedCert(
  urlEncodedCert: string
): string {
  const decodedCert = decodeURIComponent(urlEncodedCert);

  const pemCert = decodedCert
    .replace("-----BEGIN CERTIFICATE-----", "")
    .replace("-----END CERTIFICATE-----", "")
    .replace(/\s+/g, "");

  const formattedPemCert = `-----BEGIN CERTIFICATE-----\n${pemCert
    .match(/.{1,64}/g)
    ?.join("\n")}\n-----END CERTIFICATE-----`;

  const x509 = new X509();
  x509.readCertPEM(formattedPemCert);

  return x509.getSerialNumberHex();
}

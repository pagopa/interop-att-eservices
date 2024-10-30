import crypto from "crypto";

// Chiave pubblica in formato PEM
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvvUQjnpILrt6c3ORihSM
mswDkdxd55ECsSGWT02Cb5tXASdUDjxtNEbVXvzyZ2XruF0GW7r1BdswA4Mavbfl
gVMNjDVnSLlH4rnvULM4LVvmxKExe7w/ZAxxdBauZBHWziHv680o8jXDrblHAYMD
w7sXljaiAsvwZ3j/lND63m7zvtVvuOQc/8m+zrnYZy9vFpri45/ELpg21mlrF+Ys
duGkkYDejKaDt8F4fUrUJbaXj1lXkNeT6eOk2Qv2wLQjeadHpR4bVbYlEpJmHV/R
6iSHe6krqU8BwlKmI/qmmIYZzw//rQR9Apds7/L/TaimRcy5DA9y0fHG/BPxbgoL
AwIDAQAB
-----END PUBLIC KEY-----`;

// Dati originali
const data = JSON.stringify({
  data: {
    idSubject: "BCCBBB88R61A125U",
    valid: false,
    message: "Codice fiscale non valido",
  },
});
// Firma come array di byte
const signatureBytes = [
  171, 23, 135, 250, 63, 164, 26, 248, 37, 160, 178, 190, 211, 255, 0, 115, 227,
  30, 101, 47, 80, 22, 137, 50, 75, 245, 182, 156, 126, 223, 31, 251, 222, 2,
  237, 187, 121, 119, 84, 26, 82, 31, 112, 56, 240, 72, 24, 179, 32, 206, 163,
  225, 50, 22, 119, 2, 75, 75, 67, 209, 234, 240, 64, 216, 92, 154, 46, 95, 119,
  147, 187, 51, 39, 79, 241, 94, 120, 251, 108, 148, 78, 203, 111, 182, 153, 91,
  111, 5, 76, 233, 116, 177, 229, 141, 105, 128, 124, 6, 246, 29, 61, 59, 6,
  135, 159, 228, 245, 255, 43, 27, 134, 112, 111, 83, 186, 164, 127, 141, 156,
  236, 164, 156, 125, 202, 57, 177, 135, 215, 241, 14, 248, 13, 34, 66, 100, 96,
  253, 45, 122, 239, 197, 136, 209, 180, 144, 116, 89, 30, 117, 60, 237, 243,
  124, 47, 97, 100, 42, 192, 246, 148, 3, 249, 72, 50, 77, 136, 69, 205, 252,
  150, 207, 144, 155, 15, 63, 203, 235, 98, 3, 43, 139, 134, 74, 238, 37, 1,
  165, 240, 34, 32, 176, 69, 10, 142, 211, 105, 215, 249, 22, 128, 75, 219, 129,
  162, 211, 40, 134, 147, 85, 225, 117, 148, 100, 69, 65, 2, 136, 223, 126, 57,
  130, 93, 38, 14, 255, 217, 248, 22, 231, 228, 129, 141, 190, 41, 66, 149, 9,
  166, 103, 132, 76, 214, 2, 190, 41, 22, 2, 8, 219, 5, 155, 95, 144, 82, 128,
  215,
];

// Convertire la firma in un Buffer
const signature = Buffer.from(signatureBytes);

// Verifica della firma
const verify = crypto.createVerify("SHA256");
verify.update(data);
verify.end();

const isVerified = verify.verify(publicKey, signature);

// Stampa dei dettagli
console.log(`Dati originali: ${data}`);
console.log(`Firma (in byte): ${signature.toString("hex")}`);
console.log(`Risultato verifica: ${isVerified ? "valida" : "non valida"}`);

// Se la firma non è valida, possiamo fornire un messaggio dettagliato
if (!isVerified) {
  console.log("La firma non è valida. Possibili motivi:");
  console.log("- I dati originali sono diversi da quelli firmati.");
  console.log(
    "- La chiave pubblica non corrisponde alla chiave privata utilizzata per firmare."
  );
  console.log("- La firma è stata alterata o danneggiata.");
}

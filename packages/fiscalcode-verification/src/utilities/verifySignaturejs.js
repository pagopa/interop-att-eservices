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
const signatureBase64 =
  "qxeH+j+kGvgloLK+0/8Ac+MeZS9QFokyS/W2nH7fH/veAu27eXdUGlIfcDjwSBizIM6j4TIWdwJLS0PR6vBA2FyaLl93k7szJ0/xXnj7bJROy2+2mVtvBUzpdLHljWmAfAb2HT07Boef5PX/KxuGcG9TuqR/jZzspJx9yjmxh9fxDvgNIkJkYP0teu/FiNG0kHRZHnU87fN8L2FkKsD2lAP5SDJNiEXN/JbPkJsPP8vrYgMri4ZK7iUBpfAiILBFCo7Tadf5FoBL24Gi0yiGk1XhdZRkRUECiN9+OYJdJg7/2fgW5+SBjb4pQpUJpmeETNYCvikWAgjbBZtfkFKA1w==";

// Converti la firma base64 in un Buffer
const signature = Buffer.from(signatureBase64, "base64");

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

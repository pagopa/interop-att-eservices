import express from "express";
import { InteroperabilityConfig } from "pdnd-common";
import { zodiosCtx, contextDataMiddleware } from "pdnd-common";
import { integrityValidationMiddleware } from "./interoperability/integrityValidationMiddleware.js";
import { auditValidationMiddleware } from "./interoperability/auditValidationMiddleware.js";
import apiRoutes from "./routers/index.js";
import TokenService from "./services/TokenService.js";
 import { logger } from "pdnd-common";
const app = zodiosCtx.app();

app.use(express.json());
app.use(contextDataMiddleware);
const config = InteroperabilityConfig.parse(process.env);
logger.info(
  `config.skipInteroperabilityVerification  ${config.skipInteroperabilityVerification}`
);

if (!config.skipInteroperabilityVerification) {
  // app.use(authenticationMiddleware());
  app.use(integrityValidationMiddleware());
  app.use(auditValidationMiddleware());
}

app.use("/", apiRoutes);

// Crea un nuovo router Express
const router = express.Router();

// Definisci la gestione della route GET

router.get("/", (req, res) => {
  // Verifica se è presente l'header 'Agid-JWT-Signature'
  const agidJwtSignature = req.headers["agid-jwt-signature"];

  if (!agidJwtSignature) {
    return res.status(400).send('Header "Agid-JWT-Signature" mancante');
  }

  // Converti il valore in una stringa
  const jwtSignatureString = Array.isArray(agidJwtSignature)
    ? agidJwtSignature[0]
    : agidJwtSignature;
  // Questo gestore viene eseguito quando arriva una richiesta GET su '/'
  try {
    // Chiamata a validate utilizzando l'Agid-JWT-Signature dall'header
    const isValid = TokenService.validate(jwtSignatureString);
    if (!isValid) {
      return res.status(401).send("Token non valido");
    }

    // Se la validazione ha successo, invia una risposta positiva
    res.send("Questa è una risposta da GET");
  } catch (error) {
    logger.error(`Errore durante la validazione del token:  ${error}`);
    res
      .status(500)
      .send("Si è verificato un errore durante la validazione del token");
  }
  return "done";
});
app.use("/token", router); // '/api' è il percorso a cui è collegato il router

export default app;

/* eslint-disable no-console */
import fs from "fs";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import { sha256, encodeBase64 } from "./utils/commons";
import {
  generate_agid_jwt_signature_integrity,
  generate_agid_jwt_trackingevidence_audit,
} from "./utils/token-generator";
import {
  exec_pdnd_client_assertion,
  get_pdnd_token,
} from "./utils/client-assertion";
import { signalHubService } from "./signalHub/service/signalHub.service";

const app: Application = express();
dotenv.config();

app.use(express.json());

app.post("/", async (req: Request, res: Response): Promise<void> => {
  const canonicalBody = JSON.stringify(req.body);
  console.log(`CANONICAL ${canonicalBody}`);
  const body_digest_bytes = sha256(canonicalBody);
  const body_digest_64 = encodeBase64(body_digest_bytes);
  const digest_header = `SHA-256=${body_digest_64}`;

  const filePathKey = process.env.PRIVATE_KEY_PATH;
  if (!filePathKey) {
    throw new Error("File private key not defined in .env configuration");
  }
  const privateKey = fs.readFileSync(filePathKey, "utf-8");

  const signature_jwt = generate_agid_jwt_signature_integrity(
    digest_header,
    privateKey
  );

  const tracking_jwt = generate_agid_jwt_trackingevidence_audit(privateKey);

  const tracking_jwt_digest = sha256(tracking_jwt);

  const client_assertion = exec_pdnd_client_assertion(
    tracking_jwt_digest,
    privateKey
  );

  const pdnd_token = await get_pdnd_token(client_assertion);

  const myJson = {
    signature_jwt,
    tracking_jwt,
    pdnd_token,
  };

  res.json(myJson);
});

app.get("/signalhub/test-pull-signals", async (req: Request, res: Response) => {
  console.log(
    "[ANPR-Request] Ricevuta richiesta su /signalhub/test-pull-signals"
  );

  const authorizationHeader = req.headers.authorization;
  console.log(
    "[ANPR-Request] Header Authorization ricevuto:",
    authorizationHeader
  );
  const sizeParam = req.query.size as string | undefined;
  const size = sizeParam ? parseInt(sizeParam, 10) : 10;

  if (isNaN(size) || size <= 0) {
    console.warn("[ANPR-Request] Parametro 'size' non valido.");
    return res.status(400).json({ error: "Parametro 'size' non valido." });
  }

  const signalIdParam = req.query.signalId as string | undefined;
  const startSignalId = signalIdParam ? parseInt(signalIdParam, 10) : 0;
  if (isNaN(startSignalId) || startSignalId < 0) {
    console.warn("[ANPR-Request] Parametro 'signalId' non valido.");
    return res.status(400).json({ error: "Parametro 'signalId' non valido." });
  }
  const cfParam = req.query.cf as string | undefined;

  if (!cfParam) {
    console.warn("[ANPR-Request] Parametro 'cf' (Codice Fiscale) mancante.");
    return res
      .status(400)
      .json({ error: "Parametro 'cf' (Codice Fiscale) mancante." });
  }

  if (!authorizationHeader) {
    console.warn("[ANPR-Request] Header Authorization mancante.");
    return res.status(401).json({ error: "Header Authorization mancante." });
  }

  try {
    const result = await signalHubService.processSignalsForTest(
      authorizationHeader,
      size,
      cfParam,
      startSignalId
    );

    res.status(200).json({
      message: "Processo di polling terminato.",
      ...result,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || String(error);
    console.error(`[ANPR-Request] Errore critico: ${errorMessage}`);
    res.status(500).json({
      error: "Errore interno del server durante il processamento dei segnali.",
      details: errorMessage,
    });
  }
});

export default app;

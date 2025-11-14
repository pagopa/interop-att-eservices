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
import { getPDNDTokenM2M } from "./signalHub/service/pdndTokneGenerator";

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
    "[ANPR-Request] Received request on /signalhub/test-pull-signals"
  );

  const authorizationHeader = req.headers.authorization;
  console.log(
    "[ANPR-Request] Authorization Header received:",
    authorizationHeader
  );
  const sizeParam = req.query.size as string | undefined;
  const size = sizeParam ? parseInt(sizeParam, 10) : 10;

  if (isNaN(size) || size <= 0) {
    console.warn("[ANPR-Request] Invalid 'size' parameter.");
    return res.status(400).json({ error: "Invalid 'size' parameter." });
  }

  const signalIdParam = req.query.signalId as string | undefined;
  const startSignalId = signalIdParam ? parseInt(signalIdParam, 10) : 0;
  if (isNaN(startSignalId) || startSignalId < 0) {
    console.warn("[ANPR-Request] Invalid 'signalId' parameter.");
    return res.status(400).json({ error: "Invalid 'signalId' parameter." });
  }
  const cfParam = req.query.cf as string | undefined;

  if (!cfParam) {
    console.warn("[ANPR-Request] 'cf' (Fiscal Code) parameter is missing.");
    return res
      .status(400)
      .json({ error: "'cf' (Fiscal Code) parameter is missing." });
  }

  if (!authorizationHeader) {
    console.warn("[ANPR-Request] Authorization Header is missing.");
    return res.status(401).json({ error: "Authorization Header is missing." });
  }
  try {
    console.log(`headers: ${JSON.stringify(req.headers)}`);
    const m2mToken = req.headers.m2mtoken as string | undefined;
    if (!m2mToken) {
      return res.status(500).json({
        error: `Internal error when generating M2M token.`,
      });
    }
    const result = await signalHubService.processSignalsForTest(
      authorizationHeader,
      m2mToken,
      size,
      cfParam,
      startSignalId
    );

    res.status(200).json(result);
  } catch (error) {
    const errorMessage = (error as Error).message || String(error);
    console.error(`[ANPR-Request] Critical error: ${errorMessage}`);
    res.status(500).json({
      error: "Internal server error during signal processing.",
      details: errorMessage,
    });
  }
});

app.get("/signalhub/m2mToken", async (req: Request, res: Response) => {
  try {
    const token = await getPDNDTokenM2M();
    if (!token) {
      return res.status(500).json({ error: "Failed to generate M2M token." });
    }
    res.status(200).json({ m2mToken: token });
  } catch (error) {
    const errorMessage = (error as Error).message || String(error);
    console.error(`[ANPR-Request] Critical error: ${errorMessage}`);
    res.status(500).json({
      error: "Internal server error during M2M token generation.",
      details: errorMessage,
    });
  }
});

export default app;

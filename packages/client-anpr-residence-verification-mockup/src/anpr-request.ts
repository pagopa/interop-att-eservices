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

export default app;

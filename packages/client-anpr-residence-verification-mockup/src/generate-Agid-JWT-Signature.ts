import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const privateKey = fs.readFileSync("client-test-keypair.rsa.priv", "utf-8");
const secretKey = process.env.JWT_SECRET || privateKey;

const now = Math.floor(Date.now() / 1000);
const payload = {
  jti: uuidv4(),
  iss: "ea83454c-2dbb-44e1-a909-a62082337532",
  sub: "ea83454c-2dbb-44e1-a909-a62082337532",
  aud: "https://modipa-val.anpr.interno.it/govway/rest/in/MinInternoPortaANPR/C008-servizioVerificaDichResidenza/v1",
  signed_headers: [
    {
      "content-type": "application/json",
    },
    {
      digest:
        "SHA-256=a2da38246495c0d148b2541f62567abf9239983c60834ae18cb6f38727813765", // SHA256 of the body payload related to EService request [Empty for /status that has a GET method]
    },
  ],
  iat: now,
  nbf: now,
  exp: now + 60 * 60 * 24, // expire in 1 day
};

const headers = {
  alg: "RS256",
  typ: "JWT",
  kid: process.env.JWT_HEADER_KID || "defaultKid",
};

const token = jwt.sign(payload, secretKey, { header: headers });

console.log("JWT:", token);

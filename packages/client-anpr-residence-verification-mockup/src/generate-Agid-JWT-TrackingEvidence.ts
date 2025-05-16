import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const privateKey = fs.readFileSync("client-test-keypair.rsa.priv", "utf-8");
const secretKey = process.env.JWT_SECRET || privateKey;

const now = Math.floor(Date.now() / 1000);

const payload = {
  userID: process.env.JWT_PAYLOAD_USERID,
  userLocation: process.env.JWT_PAYLOAD_LOCATIONID,
  LoA: process.env.JWT_PAYLOAD_LOA,
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

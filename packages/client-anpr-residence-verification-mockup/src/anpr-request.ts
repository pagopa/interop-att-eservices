import dotenv from "dotenv";

//process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

import fs from "fs";
import { sha256, encodeBase64, service_request_body } from "./utils/commons";
import {
  generate_agid_jwt_signature_integrity,
  generate_agid_jwt_trackingevidence_audit,
} from "./utils/token-generator";
import {
  exec_pdnd_client_assertion,
  get_pdnd_token,
} from "./utils/client-assertion";
import axios from "axios";
import https from "https";

dotenv.config();

// Digest SHA-256
const body_digest_bytes = sha256(JSON.stringify(service_request_body));
const body_digest_64 = encodeBase64(body_digest_bytes);
const digest_header = `SHA-256=${body_digest_64}`;

// Read private key
const filePathKey = process.env.PRIVATE_KEY_PATH;
if (!filePathKey) {
  throw new Error("File private key not defined in .env configuration");
}
const privateKey = fs.readFileSync(filePathKey, "utf-8");

const filePathCert = process.env.CERTIFICATE_PATH;
if (!filePathCert) {
  throw new Error("File certificate not defined in .env configuration");
}
const certificate = fs.readFileSync(filePathCert, "utf8");

const signature_jwt = generate_agid_jwt_signature_integrity(
  digest_header,
  privateKey
);
console.log(`Signature jwt: ${signature_jwt}`);

const tracking_jwt = generate_agid_jwt_trackingevidence_audit(privateKey);
console.log(`Tracking jwt: ${tracking_jwt}`);

// Prepare digest for tracking jwt in order to add it to client-assertion
const tracking_jwt_digest = sha256(tracking_jwt);

// Exec PDND Client-assertion
const client_assertion = exec_pdnd_client_assertion(
  tracking_jwt_digest,
  privateKey
);

const exec_eservice_call = async () => {
  try {
    const pdnd_token = await get_pdnd_token(client_assertion);
    console.log(`PDND Token: ${pdnd_token}`);
    //console.log(`Digest: ${digest_header}`);

    // Adding CA
    const agent = new https.Agent({
      ca: certificate,
    });

    //console.log(JSON.stringify(agent));
    // headers EService call
    const headers = {
      Authorization: `Bearer ${pdnd_token}`,
      "Content-Type": "application/json",
      Digest: digest_header,
      "Agid-JWT-Signature": signature_jwt,
      "Agid-JWT-TrackingEvidence": tracking_jwt,
    };
    const response = await axios.post(
      process.env.ESERVICE_ENDPOINT ||
        "https://modipa-val.anpr.interno.it/govway/rest/in/MinInternoPortaANPR-PDND/C030-servizioAccertamentoIdUnicoNazionale/v1/anpr-service-e002",
      service_request_body,
      { headers, httpsAgent: agent }
    );
    console.log(`Status code: ${response.status}`);
    console.log(`Response headers: ${response.headers}`);
    console.log(`Response body: ${response.data}`);
  } catch (error: any) {
    console.log(`Error calling EService: ${error.message}`);
  }
};

exec_eservice_call();

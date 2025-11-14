import fs from "fs";
import {
  exec_pdnd_client_assertion_m2m,
  get_pdnd_token_m2m,
  logger,
  m2mConfig,
} from "../../index.js";

const config = m2mConfig();

const filePathKey = config.privateKeyPath;
if (!filePathKey) {
  throw new Error("M2M_PRIVATE_KEY_PATH not defined in .env file");
}
const privateKey = fs.readFileSync(filePathKey, "utf-8");
if (!privateKey) {
  logger.error(`Fatal error: failed to read private key from ${filePathKey}.`);
  throw new Error("Could not start server. M2M private key not found.");
}
export async function getPDNDTokenM2M(): Promise<string | undefined> {
  logger.info("Generating a new PDND M2M token...");
  try {
    const client_assertion = exec_pdnd_client_assertion_m2m(privateKey);
    const token = await get_pdnd_token_m2m(client_assertion);

    if (!token) {
      throw new Error("get_pdnd_token did not return a token.");
    }

    logger.info("New PDND M2M token generated successfully.");
    return token;
  } catch (error) {
    logger.error("Error during PDND token generation:", error);
    throw error;
  }
}

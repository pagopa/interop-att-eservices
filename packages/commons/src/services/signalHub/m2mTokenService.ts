import fs from "fs";
import {
  exec_pdnd_client_assertion_m2m,
  get_pdnd_token_m2m,
  logger,
  M2mConfig,
} from "../../index.js";

export async function getPDNDTokenM2M(
  config: M2mConfig
): Promise<string | undefined> {
  logger.info("Generating a new PDND M2M token...");
  try {
    const client_assertion = exec_pdnd_client_assertion_m2m(config);
    const token = await get_pdnd_token_m2m(await client_assertion, config);

    if (!token) {
      throw new Error("get_pdnd_token did not re  turn a token.");
    }

    logger.info("New PDND M2M token generated successfully.");
    return token;
  } catch (error) {
    logger.error("Error during PDND token generation:", error);
    throw error;
  }
}

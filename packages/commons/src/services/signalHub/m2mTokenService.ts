import { get_pdnd_token_m2m, logger, M2mConfig } from "../../index.js";

export async function getPDNDTokenM2M(
  config: M2mConfig
): Promise<string | undefined> {
  logger.info("Generating a new PDND M2M token...");
  try {
    const token = await get_pdnd_token_m2m(config);
    logger.info("New PDND M2M token generated successfully.");
    return token;
  } catch (error) {
    logger.error("Error during PDND token generation:", error);
    throw error;
  }
}

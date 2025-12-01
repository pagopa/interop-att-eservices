import axios from "axios";
import { getPDNDTokenM2M, logger } from "pdnd-common";
import { shConfig } from "../config/config.js";

const config = shConfig();

const SIGNAL_HUB_HOST = config.signalHubHost;
const SIGNAL_HUB_API_VERSION = config.signalHubApiVersion;
const SIGNAL_HUB_AUTH_TOKEN = await getPDNDTokenM2M();

if (!SIGNAL_HUB_HOST || !SIGNAL_HUB_API_VERSION || !SIGNAL_HUB_AUTH_TOKEN) {
  throw new Error("Missing Signal Hub configuration");
}

export const SignalHubClient = {
  async sendSeedUpdateSignal(
    eserviceId: string,
    signalId: number
  ): Promise<void> {
    const url = `${SIGNAL_HUB_HOST}/${SIGNAL_HUB_API_VERSION}/push/signals`;
    const payload = {
      signalId,
      signalType: "SEEDUPDATE",
      eserviceId,
      objectType: "-",
      objectId: "-",
    };

    logger.info(
      `[SignalHubClient] Sending payload: ${JSON.stringify(payload)}`
    );

    await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${SIGNAL_HUB_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
  },
};

import axios from "axios";
import { getPDNDTokenM2M } from "pdnd-common";
import { shConfig } from "../config/config.js";

const SIGNAL_HUB_HOST = shConfig.signalHubHost;
const SIGNAL_HUB_API_VERSION = shConfig.signalHubApiVersion;
const SIGNAL_HUB_AUTH_TOKEN = await getPDNDTokenM2M(shConfig);

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

    await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${SIGNAL_HUB_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
  },
};

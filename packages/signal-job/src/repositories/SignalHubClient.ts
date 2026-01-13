import axios from "axios";
import { getPDNDTokenM2M } from "pdnd-common";
import { shConfig } from "../config/config.js";

const SIGNAL_HUB_HOST = shConfig.signalHubHost;
const SIGNAL_HUB_API_VERSION = shConfig.signalHubApiVersion;

// eslint-disable-next-line functional/no-let
let SIGNAL_HUB_AUTH_TOKEN: string | undefined;

if (!SIGNAL_HUB_HOST || !SIGNAL_HUB_API_VERSION) {
  throw new Error("Missing Signal Hub configuration");
}

async function getAuthToken(): Promise<string> {
  if (!SIGNAL_HUB_AUTH_TOKEN) {
    SIGNAL_HUB_AUTH_TOKEN = await getPDNDTokenM2M(shConfig);
    if (!SIGNAL_HUB_AUTH_TOKEN) {
      throw new Error("Failed to obtain PDND M2M token");
    }
  }
  return SIGNAL_HUB_AUTH_TOKEN;
}

export const SignalHubClient = {
  async sendSeedUpdateSignal(
    eserviceId: string,
    signalId: number
  ): Promise<void> {
    const token = await getAuthToken();

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
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  },
};

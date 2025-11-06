import axios from "axios";
import { shConfig } from "../config/config.js";

const config = shConfig();

/
const SIGNAL_HUB_HOST = config.SIGNAL_HUB_HOST;
const SIGNAL_HUB_API_VERSION = config.SIGNAL_HUB_API_VERSION;
const SIGNAL_HUB_AUTH_TOKEN = config.SIGNAL_HUB_AUTH_TOKEN

if (!SIGNAL_HUB_HOST || !SIGNAL_HUB_API_VERSION || !SIGNAL_HUB_AUTH_TOKEN) {
  throw new Error("Missing Signal Hub configuration"); // TODO: add better error logger
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

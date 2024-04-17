import { getContext } from "pdnd-common";
import { validate } from "../interoperability/interoperabilityValidationMiddleware.js";

class tokenService {
  appContext = getContext();

  public async validate(token: string): Promise<void | null> {
    validate(token); // kid agid nel token
  }
}

export default new tokenService();

import {
  ExpressContext,
  getContext,
  logger,
  DataPreparationHandshakeService,
} from "pdnd-common";
import { ZodiosRouterContextRequestHandler } from "@zodios/express";
import { match } from "ts-pattern";
import { makeApiProblem } from "../exceptions/errors.js";
import { getSerialNumberFromUrlEncodedCert } from "../utilities/certificateUtility.js";
import { ErrorHandling } from "../../../models/dist/errorHandling.js";

export const verifyCertValidity: ZodiosRouterContextRequestHandler<
  ExpressContext
> = async (req, res, next) => {
  try {
    const headerCert = Array.isArray(req.headers["x-amzn-mtls-clientcert"])
      ? req.headers["x-amzn-mtls-clientcert"][0]
      : req.headers["x-amzn-mtls-clientcert"] ?? null;

    if (!headerCert) {
      logger.error("No certificate uploaded");
      throw ErrorHandling.certificateNotValidError();
    }

    const apiKey: string | undefined = req.headers.apikey as string | undefined;
    if (!apiKey) {
      logger.error("Header apikey is mandatory.");
      throw ErrorHandling.apikeyNotValidError();
    }

    const serialNumber = getSerialNumberFromUrlEncodedCert(headerCert);

    const appContext = getContext();
    const handshake = await DataPreparationHandshakeService.getByApikey(
      appContext.authData.purposeId
    );

    if (handshake?.cert !== serialNumber) {
      logger.error(`Invalid certificate`);
      throw ErrorHandling.certificateNotValidError();
    }
    next();
  } catch (error) {
    logger.error(
      `An error occurred while verifying the certificate validity: ${error}`
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const problem = makeApiProblem(error, (err: { code: any }) =>
      match(err.code)
        .with("unauthorizedError", () => 401)
        .with("operationForbidden", () => 403)
        .with("missingHeader", () => 400)
        .with("certNotValid", () => 400)
        .with("apikeyNotValid", () => 400)
        .otherwise(() => 500)
    );
    res.status(problem.status).json(problem).end();
  }
};

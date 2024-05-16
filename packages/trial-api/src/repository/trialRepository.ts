import { getContext, logger } from "pdnd-common";
import { ErrorHandling } from "pdnd-models";
import { Trial } from "../model/trial.js";
import { getCheckValue } from "../model/check.js";

export class TrialRepository {
  public static async insert(
    operationPath: string,
    checkName: string,
    response?: boolean,
    message?: string
  ) {
    try {
      const context = getContext();

      const checkId: number | undefined = getCheckValue(checkName);
      if (!checkId) {
        throw ErrorHandling.genericError(
          `trialEvent - check name '${checkName}' does not exist`
        );
      }

      const newTrial = await Trial.create({
        id: null,
        purpose_id: context.authData.purposeId,
        correlation_id: context.correlationId,
        operation_path: operationPath,
        check_id: checkId,
        response,
        message,
      });

      // Output del record creato
      logger.info(
        `TrialRepository - Nuovo record Trial creato: ${newTrial.dataValues.id}`
      );
    } catch (error) {
      logger.error(
        `Errore durante l'inserimento del record Trial con operation path '${operationPath}' e checkName '${checkName}' with error: ${error}`
      );
    }
  }
}

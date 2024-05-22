import { getContext, logger } from "pdnd-common";
import { ErrorHandling } from "pdnd-models";
import { Trial } from "../model/trial.js";
import { getCheckValue } from "../model/check.js";

export class TrialRepository {
  public static async insert(
    operationPath: string,
    operationMethod: string,
    checkName: string,
    response?: string,
    message?: string,
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
        operation_method: operationMethod,
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

  public static async findByCorrelationId(correlationId: string) {
    try {
      const trials = await Trial.findAll({
        where: {
          correlation_id: correlationId,
        },
      });

      logger.info(
        `TrialRepository - Trovati ${trials.length} record(s) Trial con correlationId: ${correlationId}`
      );

      return trials;
    } catch (error) {
      logger.error(
        `Errore durante la ricerca dei record Trial con correlationId '${correlationId}' con errore: ${error}`
      );
      throw error; // Rilancia l'errore per una gestione esterna se necessario
    }
  }

 
}

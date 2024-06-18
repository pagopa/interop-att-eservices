import { TrialRepository } from "../index.js";
import { Trial } from "../model/trial.js";

export class TrialService {
  public static async insert(
    operationPath: string,
    operationMethod: string,
    checkName: string,
    response?: string,
    message?: string
  ): Promise<void> {
    TrialRepository.insert(
      operationPath,
      operationMethod,
      checkName,
      response,
      message
    );
  }
}

export async function findByCorrelationId(data: string): Promise<Trial[]> {
  return await TrialRepository.findByCorrelationId(data);
}

export async function existCorrelationId(
  correlationId: string
): Promise<boolean> {
  const trials = await findByCorrelationId(correlationId);
  return trials.length !== 0;
}

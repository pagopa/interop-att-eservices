import { TrialRepository } from "../repositories/trialRepository.js";

export class TrialService {
  public static async insert(
    operationPath: string,
    operationMethod: string,
    checkName: string,
    response?: string,
    message?: string
  ): Promise<void> {
    await TrialRepository.insert(
      operationPath,
      operationMethod,
      checkName,
      response,
      message
    );
  }

  public static async findByCorrelationId(
    correlationId: string
  ): Promise<unknown> {
    return await TrialRepository.findByCorrelationId(correlationId);
  }

  public static async existCorrelationId(
    correlationId: string
  ): Promise<unknown> {
    return await TrialRepository.existCorrelationId(correlationId);
  }
}

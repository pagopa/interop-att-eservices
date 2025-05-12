import { TrialRepository } from "../repositories/trialRepository.js";

export class TrialService {
  static async insert(
    operationPath: string,
    operationMethod: string,
    checkName: string,
    response?: string,
    message?: string
  ) {
    await TrialRepository.insert(operationPath, operationMethod, checkName, response, message);
  }

  static async findByCorrelationId(correlationId: string) {
    return await TrialRepository.findByCorrelationId(correlationId);
  }

  static async existCorrelationId(correlationId: string) {
    return await TrialRepository.existCorrelationId(correlationId);
  }
}

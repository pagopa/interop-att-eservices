import { logger, getContext, ResidenceSubmissionService } from "pdnd-common";
import { RichiestaAR003 } from "../model/domain/models.js";

class ResidenceSubmissionController {
  public appContext = getContext();

  public async createUser(
    request: RichiestaAR003
  ): Promise<{ status: string; message: string }> {
    try {
      await ResidenceSubmissionService.create(request);

      return {
        status: "OK",
        message: "User created successfully",
      };
    } catch (error) {
      logger.error(` Error in 'createUser': `, error);
      return {
        status: "KO",
        message: "saveList - Error during list saving.",
      };
    }
  }

  public async updateUser(
    request: RichiestaAR003
  ): Promise<{ status: string; message: string }> {
    try {
      await ResidenceSubmissionService.updateBySubjectId(request);

      return {
        status: "OK",
        message: "User updated successfully",
      };
    } catch (error) {
      logger.error(`Error in 'updateUser': `, error);
      return {
        status: "KO",
        message: "Error during user update.",
      };
    }
  }

  public async deleteUser(
    id: string
  ): Promise<{ status: string; message: string }> {
    try {
      await ResidenceSubmissionService.delete(id);

      return {
        status: "OK",
        message: "User deleted successfully",
      };
    } catch (error) {
      logger.error(`Error in 'deleteUser': `, error);
      return {
        status: "KO",
        message: "Error during user deletion.",
      };
    }
  }
}

export default new ResidenceSubmissionController();

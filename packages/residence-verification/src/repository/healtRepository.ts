//import { logger } from "pdnd-common";
import { cacheManager } from "pdnd-common";

class dataPreparationRepository {
  public async checkConnection(
  ): Promise<Boolean | null> {
      return await cacheManager.checkConnection();
  }


}

export default new dataPreparationRepository();

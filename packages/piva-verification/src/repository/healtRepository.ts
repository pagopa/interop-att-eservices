// import { logger } from "pdnd-common";
import { cacheManager } from "pdnd-common";

class healtRepository {
  public async checkConnection(): Promise<boolean | null> {
    return await cacheManager.checkConnection();
  }
}

export default new healtRepository();

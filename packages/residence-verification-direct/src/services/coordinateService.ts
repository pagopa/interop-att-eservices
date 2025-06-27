import NodeGeocoder from "node-geocoder";
import { logger } from "pdnd-common";
import { CoordinatesModel } from "pdnd-models";

const geocoder = NodeGeocoder({
  provider: "openstreetmap",
});

class CoordinatesService {
  public async getCoordinates(
    address: string
  ): Promise<CoordinatesModel | undefined> {
    try {
      const res = await geocoder.geocode(address);
      if (res.length > 0) {
        const coordinates: CoordinatesModel = {
          latitude: String(res[0].latitude),
          longitude: String(res[0].longitude),
        };
        return coordinates;
      } else {
        logger.info("Nessun risultato trovato.");
        return undefined;
      }
    } catch (error) {
      logger.error("Errore durante la geocodifica:", error);
      return undefined;
    }
  }
}

export default new CoordinatesService();

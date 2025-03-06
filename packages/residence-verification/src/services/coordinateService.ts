import NodeGeocoder from "node-geocoder";
import { CoordinatesModel } from "pdnd-models";


const geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GOOGLE_API,
});

 class coordinatesService {
   public async getCoordinates(
     address: string,
   ): Promise<CoordinatesModel | undefined> {
     try {
       const res = await geocoder.geocode(address);
       if (res.length > 0) {
         const coordinates: CoordinatesModel = {
           latitude: res[0].latitude,
           longitude: res[0].longitude,
         };
         return coordinates;
       } else {
         console.log("Nessun risultato trovato.");
         return undefined;
       }
     } catch (error) {
       console.error("Errore durante la geocodifica:", error);
       return undefined;
     }
   }
 }

 export default new coordinatesService();
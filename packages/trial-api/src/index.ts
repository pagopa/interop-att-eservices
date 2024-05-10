export * from "./client.js";
export * from "./model/trial.js";
export * from "./config/liquibaseConfig.js";
import { logger } from "pdnd-common";
 
// receiver.ts (pacchetto ricevente)
import { eventManager } from 'pdnd-common';


const startlistner = async (): Promise<void> => {
  try {
   
// Funzione per gestire l'evento personalizzato
function handleCustomEvent(data: any) {
    console.log('Evento personalizzato ricevuto:', data);
  }
  
  // Registra il listener per l'evento personalizzato
  eventManager.on('customEvent', (data) => {
    console.log('Listener in ascolto dell\'evento personalizzato...');
    handleCustomEvent(data);
  });
  } catch (error) {
    logger.error("SERVER NOT STARTED: ", error);
  }
};

await startlistner();


/*
public static async insert(operation_name: string, check_id: number, response?: boolean, message?: string) {
  try {
      const context = getContext();

      const newTrial = await Trial.create({
          id: null,
          purpose_id: context.authData.purposeId,
          correlation_id: context.correlationId,
          operation_name: operation_name,
          check_id: check_id,
          response: response,
          message: message,
      });

      // Output del record creato
      logger.info('TrialRepository - Nuovo record Trial creato:', newTrial.dataValues.id);
  } catch (error) {
      logger.error("Errore durante l'inserimento del record Trial:", error);
  }
}*/
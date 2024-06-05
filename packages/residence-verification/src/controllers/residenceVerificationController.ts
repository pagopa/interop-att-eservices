import { UserModel } from "pdnd-models";
import { logger, getContext } from "pdnd-common";
import ResidenceVerificationService from "../services/residenceVerificationService.js";
import { requestParamNotValid } from "../exceptions/errors.js";
import { RichiestaAR001, RispostaAR001, RispostaAR002 } from "../model/domain/models.js";
import { UserModelToApiTipoDatiSoggettiEnte } from "../model/domain/apiConverter.js";

class ResidenceVerificationController {
  public appContext = getContext();

  public async findUser(
    request: RichiestaAR001
  ): Promise<RispostaAR001 | null | undefined> {
    try {
      logger.info(`post request: ${request}`);
      if (request.parametriRicerca.codiceFiscale) {
        const data = await ResidenceVerificationService.getByFiscalCode(
          request.parametriRicerca.codiceFiscale
        );

        const list: UserModel[] = data ? [data] : [];

        const result: RispostaAR001 = {
          idOperazione: request.idOperazioneClient,
          soggetti: {
            soggetto: list.map((element) =>
              UserModelToApiTipoDatiSoggettiEnte(element)
            ),
          },
        };
        return result;
      } else if (checkPersonalInfo(request)) {
        const data = await ResidenceVerificationService.getByPersonalInfo(
          request.parametriRicerca
        );

        const result: RispostaAR001 = {
          idOperazione: request.idOperazioneClient,
          soggetti: {
            soggetto: data.map((element) =>
              UserModelToApiTipoDatiSoggettiEnte(element)
            ),
          },
        };

        return result;
      } else if (request.parametriRicerca.id) {
        if (request.parametriRicerca.id) {
          const data = await ResidenceVerificationService.getById(
            request.parametriRicerca.id
          );

          const list: UserModel[] = data ? [data] : [];

          const result: RispostaAR001 = {
            idOperazione: request.idOperazioneClient,
            soggetti: {
              soggetto: list.map((element) =>
                UserModelToApiTipoDatiSoggettiEnte(element)
              ),
            },
          };
          return result;
        }
        return null;
      } else {
        throw requestParamNotValid(
          "The request body has one or more required param not valid"
        );
      }
    } catch (error) {
      logger.error(`Error during in method controller 'findUser': `, error);
      throw error;
    }
  }


  public async findUserVerify(
    request: RichiestaAR001
  ): Promise<RispostaAR001 | null | undefined> {
    try {
      logger.info(`post request: ${request}`);
      var resultData;
      if (request.parametriRicerca.codiceFiscale) {
        const data = await ResidenceVerificationService.getByFiscalCode(
          request.parametriRicerca.codiceFiscale
        );

        const list: UserModel[] = data ? [data] : [];

        resultData = {
          idOperazione: request.idOperazioneClient,
          soggetti: {
            soggetto: list.map((element) =>
              UserModelToApiTipoDatiSoggettiEnte(element)
            ),
          },
        };
      } else if (checkPersonalInfo(request)) {
        const data = await ResidenceVerificationService.getByPersonalInfo(
          request.parametriRicerca
        );

        resultData = {
          idOperazione: request.idOperazioneClient,
          soggetti: {
            soggetto: data.map((element) =>
              UserModelToApiTipoDatiSoggettiEnte(element)
            ),
          },
        };
      } else if (request.parametriRicerca.id) {
        if (request.parametriRicerca.id) {
          const data = await ResidenceVerificationService.getById(
            request.parametriRicerca.id
          );

          const list: UserModel[] = data ? [data] : [];

          resultData = {
            idOperazione: request.idOperazioneClient,
            soggetti: {
              soggetto: list.map((element) =>
                UserModelToApiTipoDatiSoggettiEnte(element)
              ),
            },
          };
        }
        return null;
      } else {
        throw requestParamNotValid(
          "The request body has one or more required param not valid"
        );
      }
      var response: RispostaAR002 = {};
      if (request.verifica && request.verifica?.residenza) {
        if (request.verifica?.residenza?.indirizzo != resultData.soggetti.soggetto[0].zz) {

        }
        
       
      }
    } catch (error) {
      logger.error(`Error during in method controller 'findUser': `, error);
      throw error;
    }
  }
}

const checkPersonalInfo = (request: RichiestaAR001): boolean =>
  !!request.parametriRicerca.nome &&
  !!request.parametriRicerca.cognome &&
  !!request.parametriRicerca.datiNascita &&
  !!request.parametriRicerca.datiNascita.dataEvento &&
  !!request.parametriRicerca.datiNascita.luogoNascita &&
  !!request.parametriRicerca?.datiNascita?.luogoNascita?.comune?.nomeComune &&
  !!request.parametriRicerca?.datiNascita?.luogoNascita?.localita?.codiceStato;

export default new ResidenceVerificationController();

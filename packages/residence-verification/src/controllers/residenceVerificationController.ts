import { UserModel } from "pdnd-models";
import { logger, getContext } from "pdnd-common";
import ResidenceVerificationService from "../services/residenceVerificationService.js";
import {
  requestParamNotValid,
  userModelNotFound,
} from "../exceptions/errors.js";
import {
  RichiestaAR001,
  RichiestaAR002,
  RispostaAR001,
  RispostaAR002OK,
} from "../model/domain/models.js";
import { UserModelToApiTipoDatiSoggettiEnte } from "../model/domain/apiConverter.js";
import { checkInfoSoggettoEquals } from "../utilities/equalsUtilities.js";

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
    request: RichiestaAR002
  ): Promise<RispostaAR002OK> {
    try {
      logger.info(`post request: ${request}`);
      var resultData;
      if (request.criteriRicerca.codiceFiscale) {
        const data = await ResidenceVerificationService.getByFiscalCode(
          request.criteriRicerca.codiceFiscale
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
      } else if (checkPersonalInfoVerify(request)) {
        const data = await ResidenceVerificationService.getByPersonalInfo(
          request.criteriRicerca
        );

        resultData = {
          idOperazione: request.idOperazioneClient,
          soggetti: {
            soggetto: data.map((element) =>
              UserModelToApiTipoDatiSoggettiEnte(element)
            ),
          },
        };
      } else if (request.criteriRicerca.id) {
        if (request.criteriRicerca.id) {
          const data = await ResidenceVerificationService.getById(
            "" + request.criteriRicerca.id
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
      } else {
        throw requestParamNotValid(
          "The request body has one or more required param not valid"
        );
      }
      var response: RispostaAR002OK = {};
      response.idOperazione = request.idOperazioneClient;
      if (!resultData || resultData.soggetti?.soggetto?.length === 0) {
        throw userModelNotFound();
      } else {
        //vado a vedere se qualcuno ha la residenza richiesta in oggetto
        response.soggetti = { infoSoggetto: [] };
        resultData?.soggetti?.soggetto.forEach((oggetto) => {
          oggetto.residenza?.forEach((residenza) => {
            response.soggetti?.infoSoggetto?.push(
              checkInfoSoggettoEquals(request.verifica?.residenza, residenza)
            );
          });
        });
      }

      return response;
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

const checkPersonalInfoVerify = (request: RichiestaAR002): boolean =>
  !!request.criteriRicerca.nome &&
  !!request.criteriRicerca.cognome &&
  !!request.criteriRicerca.datiNascita &&
  !!request.criteriRicerca.datiNascita.dataEvento &&
  !!request.criteriRicerca.datiNascita.luogoNascita &&
  !!request.criteriRicerca?.datiNascita?.luogoNascita?.comune?.nomeComune &&
  !!request.criteriRicerca?.datiNascita?.luogoNascita?.localita?.codiceStato;
export default new ResidenceVerificationController();

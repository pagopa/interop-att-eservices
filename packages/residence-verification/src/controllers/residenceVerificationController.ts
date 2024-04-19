import { UserModel } from "pdnd-models";
import { logger, getContext } from "pdnd-common";
import ResidenceVerificationService from "../services/residenceVerificationService.js";
import { requestParamNotValid } from "../exceptions/errors.js";
import {
  RichiestaAR001,
  RispostaAR001,
  TipoListaSoggetti,
} from "../model/domain/models.js";
import {
  UserModelToApiTipoDatiSoggettiEnte,
} from "../model/domain/apiConverter.js";

class ResidenceVerificationController {
  appContext = getContext();

  public async findUser(
    request: RichiestaAR001
  ): Promise<RispostaAR001 | null | undefined> {
    try {
      logger.info(`post request: ${request}`);
      const resultSoggetti: TipoListaSoggetti[] = [];
      if (request.parametriRicerca.codiceFiscale) {
        const data = await ResidenceVerificationService.getByFiscalCode(
          request.parametriRicerca.codiceFiscale
        );
        var list: UserModel[] = [];
        if (data) {
          list.push(data);
        }
        list.forEach((element) => {
          resultSoggetti.push(UserModelToApiTipoDatiSoggettiEnte(element));
        });

        const result: RispostaAR001 = {
          idOperazione: request.idOperazioneClient,
          soggetto: resultSoggetti,
        };

        return result;
      } else if (checkPersonalInfo(request)) {
        const data = await ResidenceVerificationService.getByPersonalInfo(request.parametriRicerca);
        data.forEach(element => {
          resultSoggetti.push(UserModelToApiTipoDatiSoggettiEnte(element))
        });

        let result: RispostaAR001 = {
          idOperazione:  request.idOperazioneClient,
          soggetto: resultSoggetti,
        };

        return result;
      } else if (request.parametriRicerca.id) {
        if (request.parametriRicerca.id) {
          const data = await ResidenceVerificationService.getById(request.parametriRicerca.id);
          var list: UserModel[] = [];
          if (data) {
            list.push(data);
          }
          list.forEach((element) => {
            resultSoggetti.push(UserModelToApiTipoDatiSoggettiEnte(element));
          });
  
          const result: RispostaAR001 = {
            idOperazione: request.idOperazioneClient,
            soggetto: resultSoggetti,
          };
          return result;
        }
        return null;
      } else {
        throw requestParamNotValid("The request body has one or more required param not valid");
      }
    } catch (error) {
      logger.error(`Error during in method controller 'findUser': `, error);
      throw error;
    }
  }
}

const checkPersonalInfo = (request: RichiestaAR001): boolean => {
  if(!request.parametriRicerca.nome) {
    return false
  }
  if(!request.parametriRicerca.cognome) {
    return false
  }
  if(!request.parametriRicerca.datiNascita) {
    return false
  }
  if(!request.parametriRicerca.datiNascita.dataEvento) {
    return false
  }
  if(!request.parametriRicerca.datiNascita.luogoNascita) {
    return false
  }
  if(!request.parametriRicerca.datiNascita.luogoNascita.comune || !request.parametriRicerca.datiNascita.luogoNascita.comune.nomeComune) {
    return false
  }
  if(!request.parametriRicerca.datiNascita.luogoNascita.localita || !request.parametriRicerca.datiNascita.luogoNascita.localita.codiceStato) {
    return false
  }

  return true;
};


export default new ResidenceVerificationController();

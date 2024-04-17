import { UserModel } from "pdnd-models";
import { getContext } from "pdnd-common";

import { RichiestaAR001, RispostaAR001, TipoListaSoggetti } from "../model/domain/models.js";
import UserService  from "../services/UserService.js"
import { userModelToApiDataPreparationResponseCf, UserModelToApiTipoDatiSoggettiEnte  } from "../model/domain/apiConverter.js";

class UserController {
  appContext = getContext();

  public async findUser(request: RichiestaAR001): Promise<RispostaAR001 | null | undefined> {
    try {
      console.log("post request: " + request);
      var  resultSoggetti : TipoListaSoggetti[] = [];
      if (request.parametriRicerca.codiceFiscale) {
        const data = await UserService.getByFiscalCode(request.parametriRicerca.codiceFiscale);
        var list: UserModel[] = [];
        if (data) {
          list.push(data);
        }
        list.forEach(element => {
          resultSoggetti.push(UserModelToApiTipoDatiSoggettiEnte(element))
        });

        let result: RispostaAR001 = {
          idOperazione:  request.idOperazioneClient, 
          soggetto: resultSoggetti,
        };
        
        return result;
      } else {
        if (request.parametriRicerca.id) {
          const data = await UserService.getById(request.parametriRicerca.id);
          var list: UserModel[] = [];
          if (data) {
            list.push(data);
            const result = userModelToApiDataPreparationResponseCf(
              list,
              request.parametriRicerca.codiceFiscale
            );
            if (result) {
              return result;
            } else {
              return null
            }
          }
      }
      return null;
    }
    } catch (error) {
    
      return null;
    }
  }
}

export default new UserController();

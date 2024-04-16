import { UserModel } from "pdnd-models";
import { getContext } from "pdnd-common";

import { RichiestaAR001, DataPreparationResponse } from "../model/domain/models.js";
import UserService  from "../services/UserService.js"
import { userModelToApiDataPreparationResponseCf,  } from "../model/domain/apiConverter.js";

class UserController {
  appContext = getContext();

  public async findUser(request: RichiestaAR001): Promise<DataPreparationResponse | null | undefined> {
    try {
      console.log("post request: " + request);
      if (request.parametriRicerca.codiceFiscale) {
        const data = await UserService.getByFiscalCode(request.parametriRicerca.codiceFiscale);
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
        return null;
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

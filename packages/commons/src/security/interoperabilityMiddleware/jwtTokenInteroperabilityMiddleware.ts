import { InteroperabilityConfig } from "../../config/index.js";
  //import { signerConfig } from "../index.js";
  import axios, { AxiosResponse } from 'axios';
import {TokenResponse} from "pdnd-models"
  export async function getOauth2Token(
    assertion: string
  ): Promise<string | undefined> {
    console.log("call getOauth2Token:");
    const config = InteroperabilityConfig.parse(process.env);
  
    if (!config.issuer || !config.tokenGenerateHost) {
      return undefined;
    }
     
    const data = new URLSearchParams();
    data.append('client_id', config.issuer);
    data.append('client_assertion', assertion);
    data.append('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
    data.append('grant_type', 'client_credentials');
  
    try {
      const response: AxiosResponse<TokenResponse>  = await axios.post(config.tokenGenerateHost, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log("access_token: "+response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
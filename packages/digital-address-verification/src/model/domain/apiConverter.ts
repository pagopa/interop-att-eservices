import {   CodiceFiscaleModel,
  DigitalAddressModel,
  MotivationTerminationModel,
  UsageInfoModel,
  ElementDigitalAddressModel,
  ResponseRequestDigitalAddressModel,
  ResponseListRequestDigitalAddressModel,
  PracticalReferenceModel,
  RequestListDigitalAddressModel,
  StatusProcessingRequestModel,
  UUIDModel,
  ResponseRequestListDigitalAddressModel,
  ResponseVerifyDigitalAddressModel,
  ResponseStatusListDigitalAddressModel,
  ResponseListDigitalAddressModel, } from "pdnd-models";

import {
  CodiceFiscale,
  DigitalAddress,
  MotivationTermination,
  UsageInfo,
  ElementDigitalAddress,
  ResponseRequestDigitalAddress,
  ResponseListRequestDigitalAddress,
  PracticalReference,
  RequestListDigitalAddress,
  StatusProcessingRequest,
  UUID,
  ResponseRequestListDigitalAddress,
  ResponseVerifyDigitalAddress,
  ResponseStatusListDigitalAddress,
  ResponseListDigitalAddress,
} from "./models.js";


// 1. CodiceFiscale
export const convertCodiceFiscaleToCodiceFiscaleModel = (
  codiceFiscale: CodiceFiscale
): CodiceFiscaleModel => ({
  fiscalCode: codiceFiscale,
});

export const convertCodiceFiscaleModelToCodiceFiscale = (
  model: CodiceFiscaleModel
): CodiceFiscale => model.fiscalCode;

// 2.Digital_Address
export const DigitalAddressToDigitalAddressModel = (
  digitalAddress: DigitalAddressModel 
): DigitalAddressModel => ({
  digitalAddress: digitalAddress?.digitalAddress || "",
});

export const digitalAddressModelToDigitalAddress = (
  model: DigitalAddressModel
): DigitalAddress => model.digitalAddress;

// 3. Motivation_Termination
export const MotivationTerminationToMotivationTerminationModel = (
  motivationTermination: MotivationTermination 
): MotivationTerminationModel => (
  motivationTermination
);

export const motivationTerminationModelToMotivationTermination = (
  model: MotivationTerminationModel
): MotivationTermination =>  model;

// 4. Usage_Info
export const usageInfoToUsageInfoModel = (
  template: UsageInfo 
): UsageInfoModel => ({
  motivation: MotivationTerminationToMotivationTerminationModel(template?.motivation),
  dateEndValidity: template?.dateEndValidity || "",
});

export const usageInfoModelTousageInfo = (
  model: UsageInfoModel
): UsageInfo => ({ 
  motivation: motivationTerminationModelToMotivationTermination(model.motivation),
  dateEndValidity: model.dateEndValidity,
});

// 5. Element_Digital_Address
export const ElementDigitalAddressToElementDigitalAddressModel = (
  object: ElementDigitalAddress 
): ElementDigitalAddressModel => ({
  digitalAddress: object?.digitalAddress || "",
  practicedProfession: object?.practicedProfession,
  usageInfo: usageInfoToUsageInfoModel(object?.usageInfo),
});

export const elementDigitalAddressModelToElementDigitalAddress = (
  model: ElementDigitalAddressModel
): ElementDigitalAddress => ({ 
  digitalAddress: model.digitalAddress,
  practicedProfession: model.practicedProfession,
  usageInfo: usageInfoModelTousageInfo(model.usageInfo),
});

// 6. Response_Request_Digital_Address
export const ResponseRequestDigitalAddressToResponseRequestDigitalAddressModel = (
  object: ResponseRequestDigitalAddress 
): ResponseRequestDigitalAddressModel => ({
  codiceFiscale: object?.codiceFiscale || "",
  since: object?.since || "",
  digitalAddress: (object?.digitalAddress || []).map(ElementDigitalAddressToElementDigitalAddressModel),
});

export const responseRequestDigitalAddressModelToResponseRequestDigitalAddress = (
  model: ResponseRequestDigitalAddressModel
): ResponseRequestDigitalAddress => ({ 
  codiceFiscale: model.codiceFiscale,
  since: model.since,
  digitalAddress: model.digitalAddress.map(elementDigitalAddressModelToElementDigitalAddress),
});

// Funzione che prende in input un array di ResponseRequestDigitalAddressModel, chiama la funzione di conversione e restituisce un array di ResponseRequestDigitalAddress
export const convertArrayOfModelToResponseRequestDigitalAddress = (
  models: ResponseRequestDigitalAddressModel[]
): ResponseRequestDigitalAddress[] => {
  return models.map(responseRequestDigitalAddressModelToResponseRequestDigitalAddress);
};

// Funzione unificata
export const convertArrayOfModelsToResponseListRequestDigitalAddress = (
  models: ResponseRequestDigitalAddressModel[]
): ResponseListRequestDigitalAddress => {
  // Converti l'array di ResponseRequestDigitalAddressModel a ResponseRequestDigitalAddress
  const convertedModels: ResponseRequestDigitalAddress[] = convertArrayOfModelToResponseRequestDigitalAddress(models);

  // Crea un oggetto conforme a ResponseListRequestDigitalAddress
  const responseList: ResponseListRequestDigitalAddress = {
    data: convertedModels.length ? convertedModels : [],
  };

  return responseList;
};

// 7. Response_Request_Digital_Address
export const ResponseListRequestDigitalAddressToResponseListRequestDigitalAddressModel = (
  object: ResponseListRequestDigitalAddress 
): ResponseListRequestDigitalAddressModel => ({
  data: (object?.data || []).map(ResponseRequestDigitalAddressToResponseRequestDigitalAddressModel),
});

export const responseListRequestDigitalAddressModelToResponseListRequestDigitalAddress = (
  model: ResponseListRequestDigitalAddressModel
): ResponseListRequestDigitalAddress => ({ 
  data: model.data?.map(responseRequestDigitalAddressModelToResponseRequestDigitalAddress),
});

// 8. Response_Request_Digital_Address
export const PracticalReferenceToPracticalReferenceModel = (
  praticaReference: PracticalReference 
): PracticalReferenceModel => ({
  practicalReference: praticaReference,
});

export const practicalReferenceModelToPracticalReference = (
  model: PracticalReferenceModel
): PracticalReference => model.practicalReference;

// 9. Request_List_Digital_Address
export const RequestListDigitalAddressToRequestListDigitalAddressModel = (
  object: RequestListDigitalAddress 
): RequestListDigitalAddressModel => ({
  codiciFiscali: object?.codiciFiscali || [],
  praticalReference: object?.praticalReference || "",
});

export const requestListDigitalAddressModelToRequestListDigitalAddress = (
  model: RequestListDigitalAddressModel
): RequestListDigitalAddress => ({ 
  codiciFiscali: model.codiciFiscali,
  praticalReference: model.praticalReference,
});

// 10. Status_Processing_Request
export const StatusProcessingRequestToStatusProcessingRequestModel = (
  object: StatusProcessingRequest 
): StatusProcessingRequestModel => (
  object
);

export const statusProcessingRequestModelToStatusProcessingRequest = (
  model: StatusProcessingRequestModel
): StatusProcessingRequest => model;

// 11. UUID
export const UUIDToUUIDModel = (
  object: UUID 
): UUIDModel => object;

export const uuidModelToUUID = (
  model: UUIDModel
): UUID => model;

// 12. Response_Request_List_Digital_Address
export const ResponseRequestListDigitalAddressToResponseRequestListDigitalAddressModel = (
  object: ResponseRequestListDigitalAddress 
): ResponseRequestListDigitalAddressModel => ({
  state: StatusProcessingRequestToStatusProcessingRequestModel(object?.state),
  message: object?.message || "",
  id: object?.id || "",
  dateTimeRequest: object?.dateTimeRequest || "",
});

export const responseRequestListDigitalAddressModelToResponseRequestListDigitalAddress = (
  model: ResponseRequestListDigitalAddressModel
): ResponseRequestListDigitalAddress => ({ 
  state: statusProcessingRequestModelToStatusProcessingRequest(model.state),
  message: model.message,
  id: model.id,
  dateTimeRequest: model.dateTimeRequest,
});

// 13. Response_Verify_Digital_Address
export const ResponseVerifyDigitalAddressToResponseVerifyDigitalAddressModel = (
  object: ResponseVerifyDigitalAddress 
): ResponseVerifyDigitalAddressModel => ({
  outcome: object?.outcome || false,
  dateTimeCheck: object?.dateTimeCheck || "",
});

export const responseVerifyDigitalAddressModelToResponseVerifyDigitalAddress = (
  model: ResponseVerifyDigitalAddressModel
): ResponseVerifyDigitalAddress => ({
  outcome: model.outcome,
  dateTimeCheck: model.dateTimeCheck,
});

// 14. Response_Status_List_Digital_Address
export const ResponseStatusListDigitalAddressToResponseStatusListDigitalAddressModel = (
  object: ResponseStatusListDigitalAddress 
): ResponseStatusListDigitalAddressModel => ({
  state: StatusProcessingRequestToStatusProcessingRequestModel(object?.state),
  message: object?.message || "",
});

export const responseStatusListDigitalAddressModelToResponseStatusListDigitalAddress = (
  model: ResponseStatusListDigitalAddressModel
): ResponseStatusListDigitalAddress => ({ 
  state: statusProcessingRequestModelToStatusProcessingRequest(model.state),
  message: model.message,
});

// 15. Response_List_Digital_Address
export const ResponseListDigitalAddressToResponseListDigitalAddressModel = (
  object: ResponseListDigitalAddress // Replace 'any' with the appropriate type if known
): ResponseListDigitalAddressModel => ({
  list: (object?.list || []).map(ResponseRequestDigitalAddressToResponseRequestDigitalAddressModel),
});

export const responseListDigitalAddressModelToResponseListDigitalAddress = (
  model: ResponseListDigitalAddressModel
): ResponseListDigitalAddress => ({ // Replace 'any' with the appropriate type if known
  list: model.list.map(responseRequestDigitalAddressModelToResponseRequestDigitalAddress),
});

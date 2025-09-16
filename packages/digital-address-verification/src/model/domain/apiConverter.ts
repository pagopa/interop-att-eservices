import {
  CodiceFiscaleModel,
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
  ResponseListDigitalAddressModel,
} from "pdnd-models";

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

export const convertCodiceFiscaleToCodiceFiscaleModel = (
  codiceFiscale: CodiceFiscale
): CodiceFiscaleModel => ({
  fiscalCode: codiceFiscale,
});

export const convertCodiceFiscaleModelToCodiceFiscale = (
  model: CodiceFiscaleModel
): CodiceFiscale => model.fiscalCode;

export const DigitalAddressToDigitalAddressModel = (
  digitalAddress: DigitalAddressModel
): DigitalAddressModel => ({
  digitalAddress: digitalAddress?.digitalAddress || "",
});

export const digitalAddressModelToDigitalAddress = (
  model: DigitalAddressModel
): DigitalAddress => model.digitalAddress;

export const MotivationTerminationToMotivationTerminationModel = (
  motivationTermination: MotivationTermination
): MotivationTerminationModel => motivationTermination;

export const motivationTerminationModelToMotivationTermination = (
  model: MotivationTerminationModel
): MotivationTermination => model;

export const usageInfoToUsageInfoModel = (
  template: UsageInfo
): UsageInfoModel => ({
  reason: MotivationTerminationToMotivationTerminationModel(template?.reason),
  endDate: template?.endDate || "",
});

export const usageInfoModelTousageInfo = (
  model: UsageInfoModel
): UsageInfo => ({
  reason: motivationTerminationModelToMotivationTermination(model.reason),
  endDate: model.endDate,
});

export const ElementDigitalAddressToElementDigitalAddressModel = (
  object: ElementDigitalAddress
): ElementDigitalAddressModel => ({
  digitalAddress: object?.digitalAddress || "",
  profession: object?.profession,
  information: usageInfoToUsageInfoModel(object?.information),
});

export const elementDigitalAddressModelToElementDigitalAddress = (
  model: ElementDigitalAddressModel
): ElementDigitalAddress => ({
  digitalAddress: model.digitalAddress,
  profession: model.profession,
  information: usageInfoModelTousageInfo(model.information),
});

export const ResponseRequestDigitalAddressToResponseRequestDigitalAddressModel =
  (
    object: ResponseRequestDigitalAddress
  ): ResponseRequestDigitalAddressModel => ({
    idSubject: object?.idSubject || "",
    from: object?.from || "",
    digitalAddress: (object?.digitalAddress || []).map(
      ElementDigitalAddressToElementDigitalAddressModel
    ),
  });

export const responseRequestDigitalAddressModelToResponseRequestDigitalAddress =
  (
    model: ResponseRequestDigitalAddressModel
  ): ResponseRequestDigitalAddress => ({
    idSubject: model.idSubject,
    from: model.from,
    digitalAddress: model.digitalAddress.map(
      elementDigitalAddressModelToElementDigitalAddress
    ),
  });

export const convertArrayOfModelToResponseRequestDigitalAddress = (
  models: ResponseRequestDigitalAddressModel[]
): ResponseRequestDigitalAddress[] =>
  models.map(responseRequestDigitalAddressModelToResponseRequestDigitalAddress);

export const convertArrayOfModelsToResponseListRequestDigitalAddress = (
  models: ResponseRequestDigitalAddressModel[]
): ResponseListRequestDigitalAddress => {
  const convertedModels: ResponseRequestDigitalAddress[] =
    convertArrayOfModelToResponseRequestDigitalAddress(models);

  const responseList: ResponseListRequestDigitalAddress = {
    data: convertedModels.length ? convertedModels : [],
  };

  return responseList;
};

export const ResponseListRequestDigitalAddressToResponseListRequestDigitalAddressModel =
  (
    object: ResponseListRequestDigitalAddress
  ): ResponseListRequestDigitalAddressModel => ({
    data: (object?.data || []).map(
      ResponseRequestDigitalAddressToResponseRequestDigitalAddressModel
    ),
  });

export const responseListRequestDigitalAddressModelToResponseListRequestDigitalAddress =
  (
    model: ResponseListRequestDigitalAddressModel
  ): ResponseListRequestDigitalAddress => ({
    data: model.data?.map(
      responseRequestDigitalAddressModelToResponseRequestDigitalAddress
    ),
  });

export const PracticalReferenceToPracticalReferenceModel = (
  praticaReference: PracticalReference
): PracticalReferenceModel => ({
  practicalReference: praticaReference,
});

export const practicalReferenceModelToPracticalReference = (
  model: PracticalReferenceModel
): PracticalReference => model.practicalReference;

export const RequestListDigitalAddressToRequestListDigitalAddressModel = (
  object: RequestListDigitalAddress
): RequestListDigitalAddressModel => ({
  idSubjects: object?.idSubjects || [],
  idRequest: object?.idRequest || "",
});

export const requestListDigitalAddressModelToRequestListDigitalAddress = (
  model: RequestListDigitalAddressModel
): RequestListDigitalAddress => ({
  idSubjects: model.idSubjects,
  idRequest: model.idRequest,
});

export const StatusProcessingRequestToStatusProcessingRequestModel = (
  object: StatusProcessingRequest
): StatusProcessingRequestModel => object;

export const statusProcessingRequestModelToStatusProcessingRequest = (
  model: StatusProcessingRequestModel
): StatusProcessingRequest => model;

export const UUIDToUUIDModel = (object: UUID): UUIDModel => object;

export const uuidModelToUUID = (model: UUIDModel): UUID => model;

export const ResponseRequestListDigitalAddressToResponseRequestListDigitalAddressModel =
  (
    object: ResponseRequestListDigitalAddress
  ): ResponseRequestListDigitalAddressModel => ({
    state: StatusProcessingRequestToStatusProcessingRequestModel(object?.state),
    message: object?.message || "",
    id: object?.id || "",
    requestTimestamp: object?.requestTimestamp || "",
  });

export const responseRequestListDigitalAddressModelToResponseRequestListDigitalAddress =
  (
    model: ResponseRequestListDigitalAddressModel
  ): ResponseRequestListDigitalAddress => ({
    state: statusProcessingRequestModelToStatusProcessingRequest(model.state),
    message: model.message,
    id: model.id,
    requestTimestamp: model.requestTimestamp,
  });

export const ResponseVerifyDigitalAddressToResponseVerifyDigitalAddressModel = (
  object: ResponseVerifyDigitalAddress
): ResponseVerifyDigitalAddressModel => ({
  result: object?.result || false,
  timestampCheck: object?.timestampCheck || "",
});

export const responseVerifyDigitalAddressModelToResponseVerifyDigitalAddress = (
  model: ResponseVerifyDigitalAddressModel
): ResponseVerifyDigitalAddress => ({
  result: model.result,
  timestampCheck: model.timestampCheck,
});

export const ResponseStatusListDigitalAddressToResponseStatusListDigitalAddressModel =
  (
    object: ResponseStatusListDigitalAddress
  ): ResponseStatusListDigitalAddressModel => ({
    status: StatusProcessingRequestToStatusProcessingRequestModel(
      object?.status
    ),
    message: object?.message || "",
  });

export const responseStatusListDigitalAddressModelToResponseStatusListDigitalAddress =
  (
    model: ResponseStatusListDigitalAddressModel
  ): ResponseStatusListDigitalAddress => ({
    status: statusProcessingRequestModelToStatusProcessingRequest(model.status),
    message: model.message,
  });

export const ResponseListDigitalAddressToResponseListDigitalAddressModel = (
  object: ResponseListDigitalAddress
): ResponseListDigitalAddressModel => ({
  list: (object?.list || []).map(
    ResponseRequestDigitalAddressToResponseRequestDigitalAddressModel
  ),
});

export const responseListDigitalAddressModelToResponseListDigitalAddress = (
  model: ResponseListDigitalAddressModel
): ResponseListDigitalAddress => ({
  list: model.list.map(
    responseRequestDigitalAddressModelToResponseRequestDigitalAddress
  ),
});

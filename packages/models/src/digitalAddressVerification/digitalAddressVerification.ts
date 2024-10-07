import { z } from "zod";

// 1. CodiceFiscale
export const CodiceFiscaleModel = z.object({
  fiscalCode: z.string(),
});
export type CodiceFiscaleModel = z.infer<typeof CodiceFiscaleModel>;

// 2. Digital_Address
export const DigitalAddressModel = z.object({
  digitalAddress: z.string(),
});
export type DigitalAddressModel = z.infer<typeof DigitalAddressModel>;

// 3. Motivation_Termination
export const MotivationTerminationModel = z.enum([
  "CESSAZIONE_UFFICIO",
  "CESSAZIONE_VOLONTARIA",
]);
export type MotivationTerminationModel = z.infer<
  typeof MotivationTerminationModel
>;

// 4. Usage_Info
export const UsageInfoModel = z
  .object({
    reason: MotivationTerminationModel,
    endDate: z.string().datetime({ offset: true }),
  })
  .passthrough();
export type UsageInfoModel = z.infer<typeof UsageInfoModel>;

// 5. Element_Digital_Address
export const ElementDigitalAddressModel = z
  .object({
    digitalAddress: z
      .string()
      .regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/),
    profession: z.string().optional(),
    information: UsageInfoModel,
  })
  .passthrough();
export type ElementDigitalAddressModel = z.infer<
  typeof ElementDigitalAddressModel
>;

// 6. ResponseRequestDigitalAddress
export const ResponseRequestDigitalAddressModel = z
  .object({
    idSubject: z
      .string()
      .regex(
        /^([0-9]{11})|([A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1})$/
      ),
    from: z.string().datetime({ offset: true }),
    digitalAddress: z.array(ElementDigitalAddressModel),
  })
  .passthrough();
export type ResponseRequestDigitalAddressModel = z.infer<
  typeof ResponseRequestDigitalAddressModel
>;

// 7. Response_List_Request_Digital_Address
export const ResponseListRequestDigitalAddressModel = z
  .object({
    data: z.array(ResponseRequestDigitalAddressModel).optional(),
  })
  .passthrough();
export type ResponseListRequestDigitalAddressModel = z.infer<
  typeof ResponseListRequestDigitalAddressModel
>;

// 8. PracticalReference
export const PracticalReferenceModel = z.object({
  practicalReference: z.string(),
});
export type PracticalReferenceModel = z.infer<typeof PracticalReferenceModel>;

// 9. Request_List_Digital_Address
export const RequestListDigitalAddressModel = z
  .object({
    idSubjects: z.array(z.string()),
    idRequest: z.string(),
  })
  .passthrough();
export type RequestListDigitalAddressModel = z.infer<
  typeof RequestListDigitalAddressModel
>;

// 10. Status_Processing_Request
export const StatusProcessingRequestModel = z.enum([
  "PRESA_IN_CARICO",
  "IN_ELABORAZIONE",
  "DISPONIBILE",
]);
export type StatusProcessingRequestModel = z.infer<
  typeof StatusProcessingRequestModel
>;

// 11. UUID
export const UUIDModel = z.string();
export type UUIDModel = z.infer<typeof UUIDModel>;

// 12. Response_Request_List_Digital_Address
export const ResponseRequestListDigitalAddressModel = z
  .object({
    state: StatusProcessingRequestModel,
    message: z.string(),
    id: z
      .string()
      .min(20)
      .max(40)
      .regex(/^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/),
    requestTimestamp: z.string().datetime({ offset: true }),
  })
  .passthrough();
export type ResponseRequestListDigitalAddressModel = z.infer<
  typeof ResponseRequestListDigitalAddressModel
>;

// 13. Response_Verify_Digital_Address
export const ResponseVerifyDigitalAddressModel = z
  .object({
    result: z.boolean(),
    timestampCheck: z.string().datetime({ offset: true }),
  })
  .passthrough();
export type ResponseVerifyDigitalAddressModel = z.infer<
  typeof ResponseVerifyDigitalAddressModel
>;

// 14. Response_Status_List_Digital_Address
export const ResponseStatusListDigitalAddressModel = z
  .object({
    status: StatusProcessingRequestModel,
    message: z.string(),
  })
  .passthrough();
export type ResponseStatusListDigitalAddressModel = z.infer<
  typeof ResponseStatusListDigitalAddressModel
>;

// 15. Response_List_Digital_Address
export const ResponseListDigitalAddressModel = z
  .object({
    list: z.array(ResponseRequestDigitalAddressModel),
  })
  .passthrough();
export type ResponseListDigitalAddressModel = z.infer<
  typeof ResponseListDigitalAddressModel
>;

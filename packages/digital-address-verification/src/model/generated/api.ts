import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const CodiceFiscale = z.string();
const Digital_Address = z.string();
const Motivation_Termination = z.enum([
  "CESSAZIONE_UFFICIO",
  "CESSAZIONE_VOLONTARIA",
]);
const Usage_Info = z
  .object({
    reason: Motivation_Termination,
    endDate: z.string().datetime({ offset: true }),
  })
  .passthrough();
const Element_Digital_Address = z
  .object({
    digitalAddress: Digital_Address.regex(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    ),
    profession: z.string().optional(),
    information: Usage_Info,
  })
  .passthrough();
const Response_Request_Digital_Address = z
  .object({
    idSubject: CodiceFiscale.regex(
      /^([0-9]{11})|([A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1})$/
    ),
    from: z.string().datetime({ offset: true }),
    digitalAddress: z.array(Element_Digital_Address),
  })
  .passthrough();
const Response_List_Request_Digital_Address = z
  .object({ data: z.array(Response_Request_Digital_Address).optional() })
  .passthrough();
const PracticalReference = z.string();
const Request_List_Digital_Address = z
  .object({ idSubjects: z.array(CodiceFiscale), idRequest: PracticalReference })
  .passthrough();
const Status_Processing_Request = z.enum([
  "PRESA_IN_CARICO",
  "IN_ELABORAZIONE",
  "DISPONIBILE",
]);
const UUID = z.string();
const Response_Request_List_Digital_Address = z
  .object({
    state: Status_Processing_Request,
    message: z.string(),
    id: UUID.min(20)
      .max(40)
      .regex(/^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/),
    requestTimestamp: z.string().datetime({ offset: true }),
  })
  .passthrough();
const Response_Verify_Digital_Address = z
  .object({
    result: z.boolean(),
    timestampCheck: z.string().datetime({ offset: true }),
  })
  .passthrough();
const Response_Status_List_Digital_Address = z
  .object({ status: Status_Processing_Request, message: z.string() })
  .passthrough();
const Response_List_Digital_Address = z
  .object({ list: z.array(Response_Request_Digital_Address) })
  .passthrough();

export const schemas = {
  CodiceFiscale,
  Digital_Address,
  Motivation_Termination,
  Usage_Info,
  Element_Digital_Address,
  Response_Request_Digital_Address,
  Response_List_Request_Digital_Address,
  PracticalReference,
  Request_List_Digital_Address,
  Status_Processing_Request,
  UUID,
  Response_Request_List_Digital_Address,
  Response_Verify_Digital_Address,
  Response_Status_List_Digital_Address,
  Response_List_Digital_Address,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/digital-address-verification/data-preparation",
    alias: "dataPreparationlListDigitalAddress",
    description: `Data entry for dataPreparation`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Response_Request_Digital_Address,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `BAD_REQUEST`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `UNAUTHORIZED`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `FORBIDDEN`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `NOT_FOUND`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `INTERNAL_SERVER_ERROR`,
        schema: z.void(),
      },
      {
        status: 503,
        description: `SERVICE_UNAVAILABLE`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/digital-address-verification/data-preparation",
    alias: "getDataPreparationElencoDomiciliDigitali",
    description: `Retrieval of data inserted with dataPreparation`,
    requestFormat: "json",
    response: Response_List_Request_Digital_Address,
    errors: [
      {
        status: 400,
        description: `BAD_REQUEST`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `UNAUTHORIZED`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `FORBIDDEN`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `NOT_FOUND`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `INTERNAL_SERVER_ERROR`,
        schema: z.void(),
      },
      {
        status: 503,
        description: `SERVICE_UNAVAILABLE`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/digital-address-verification/data-preparation",
    alias: "dataPreparationDeleteDomiciliDigitali",
    description: `Deletion of all data entered with dataPreparation`,
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `BAD_REQUEST`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `UNAUTHORIZED`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `FORBIDDEN`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `NOT_FOUND`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `INTERNAL_SERVER_ERROR`,
        schema: z.void(),
      },
      {
        status: 503,
        description: `SERVICE_UNAVAILABLE`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/digital-address-verification/data-preparation/:idSubject",
    alias: "getDataPreparationElencoDomiciliDigitaliDetails",
    description: `Retrieval of data inserted with dataPreparation`,
    requestFormat: "json",
    parameters: [
      {
        name: "idSubject",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: Response_Request_Digital_Address,
    errors: [
      {
        status: 400,
        description: `BAD_REQUEST`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `UNAUTHORIZED`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `FORBIDDEN`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `NOT_FOUND`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `INTERNAL_SERVER_ERROR`,
        schema: z.void(),
      },
      {
        status: 503,
        description: `SERVICE_UNAVAILABLE`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/digital-address-verification/data-preparation/:idSubject",
    alias: "deleteDataPreparationListDigitalAddress",
    description: `Deletion of data entered with dataPreparation for the specified idSubject`,
    requestFormat: "json",
    parameters: [
      {
        name: "idSubject",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `BAD_REQUEST`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `UNAUTHORIZED`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `FORBIDDEN`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `NOT_FOUND`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `INTERNAL_SERVER_ERROR`,
        schema: z.void(),
      },
      {
        status: 503,
        description: `SERVICE_UNAVAILABLE`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/digital-address-verification/list",
    alias: "requestListDigitalAddresses",
    description: `Allows you to send a request to extract digital addresses starting from the list of subject IDs provided (up to a maximum of 1,000 subject IDs). For each subject ID you obtain the relevant digital address found at the time of extraction and, in the case of a digital address as a Professional, the professional activity carried out will also be returned. Request processing is carried out in asynchronous mode. The list, identified by a unique code, is made available through a recovery service.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Request_List_Digital_Address,
      },
    ],
    response: Response_Request_List_Digital_Address,
    errors: [
      {
        status: 400,
        description: `BAD_REQUEST`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `UNAUTHORIZED`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `FORBIDDEN`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `NOT_FOUND`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `INTERNAL_SERVER_ERROR`,
        schema: z.void(),
      },
      {
        status: 503,
        description: `SERVICE_UNAVAILABLE`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/digital-address-verification/list/response/:id",
    alias: "recoveryListDigitalAddresses",
    description: `Allows you to retrieve the list of digital domiciles identified by the unique identification code.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z
          .string()
          .min(20)
          .max(40)
          .regex(
            /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/
          ),
      },
    ],
    response: Response_List_Digital_Address,
    errors: [
      {
        status: 400,
        description: `BAD_REQUEST`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `UNAUTHORIZED`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `FORBIDDEN`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `NOT_FOUND`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `INTERNAL_SERVER_ERROR`,
        schema: z.void(),
      },
      {
        status: 503,
        description: `SERVICE_UNAVAILABLE`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/digital-address-verification/list/state/:id",
    alias: "verificaStatoRichiestaElencoDomiciliDigitali",
    description: `It allows you to check the processing status of the request for the list of digital addresses, identified by a unique code`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z
          .string()
          .min(20)
          .max(40)
          .regex(
            /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/
          ),
      },
    ],
    response: Response_Status_List_Digital_Address,
    errors: [
      {
        status: 303,
        description: `The response JSON through which the Provider indicates, based on the processing status, that the list is ready at the URL specified in the &lt;i&gt;HTTP Location header&lt;/i&gt;.`,
        schema: Response_Status_List_Digital_Address,
      },
      {
        status: 400,
        description: `BAD_REQUEST`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `UNAUTHORIZED`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `FORBIDDEN`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `NOT_FOUND`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `INTERNAL_SERVER_ERROR`,
        schema: z.void(),
      },
      {
        status: 503,
        description: `SERVICE_UNAVAILABLE`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/digital-address-verification/retrieve/:id_subject",
    alias: "retrieveDigitalAddress",
    description: `It allows you to retrieve the digital address associated with the subject&#x27;s ID at the time of consultation and, if the digital address has been selected as a Professional, also the details regarding the professional activity carried out.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id_subject",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^([0-9]{11})|([A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1})$/
          ),
      },
      {
        name: "practicalReference",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: Response_Request_Digital_Address,
    errors: [
      {
        status: 400,
        description: `BAD_REQUEST`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `UNAUTHORIZED`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `FORBIDDEN`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `NOT_FOUND`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `INTERNAL_SERVER_ERROR`,
        schema: z.void(),
      },
      {
        status: 503,
        description: `SERVICE_UNAVAILABLE`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/digital-address-verification/status",
    alias: "get_status",
    description: `Returns the application state: 200 if it works correctly
or an error if the application is temporarily unavailable
for maintenance or a technical problem.
`,
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `BAD_REQUEST`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `UNAUTHORIZED`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `FORBIDDEN`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `NOT_FOUND`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `INTERNAL_SERVER_ERROR`,
        schema: z.void(),
      },
      {
        status: 503,
        description: `SERVICE_UNAVAILABLE`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/digital-address-verification/verify/:id_subject",
    alias: "checkDigitalAdrress",
    description: `By providing the digital address, subject ID, and date as input, the service allows you to verify if, on the specified date, the digital address was associated with the indicated subject ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id_subject",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^([0-9]{11})|([A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1})$/
          ),
      },
      {
        name: "digital_address",
        type: "Query",
        schema: z
          .string()
          .regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/),
      },
      {
        name: "from",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "idPractice",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: Response_Verify_Digital_Address,
    errors: [
      {
        status: 400,
        description: `BAD_REQUEST`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `UNAUTHORIZED`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `FORBIDDEN`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `NOT_FOUND`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `INTERNAL_SERVER_ERROR`,
        schema: z.void(),
      },
      {
        status: 503,
        description: `SERVICE_UNAVAILABLE`,
        schema: z.void(),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}

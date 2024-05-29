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
    motivation: Motivation_Termination,
    dateEndValidity: z.string().datetime({ offset: true }),
  })
  .passthrough();
const Element_Digital_Address = z
  .object({
    digitalAddress: Digital_Address.regex(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    ),
    practicedProfession: z.string().optional(),
    usageInfo: Usage_Info,
  })
  .passthrough();
const Response_Request_Digital_Address = z
  .object({
    codiceFiscale: CodiceFiscale.regex(
      /^([0-9]{11})|([A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1})$/
    ),
    since: z.string().datetime({ offset: true }),
    digitalAddress: z.array(Element_Digital_Address),
  })
  .passthrough();
const Response_List_Request_Digital_Address = z
  .object({ data: z.array(Response_Request_Digital_Address).optional() })
  .passthrough();
const PracticalReference = z.string();
const Request_List_Digital_Address = z
  .object({
    codiciFiscali: z.array(CodiceFiscale),
    praticalReference: PracticalReference,
  })
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
    dateTimeRequest: z.string().datetime({ offset: true }),
  })
  .passthrough();
const Response_Verify_Digital_Address = z
  .object({
    outcome: z.boolean(),
    dateTimeCheck: z.string().datetime({ offset: true }),
  })
  .passthrough();
const Response_Status_List_Digital_Address = z
  .object({ state: Status_Processing_Request, message: z.string() })
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
    path: "/inad-verification/data-preparation",
    alias: "dataPreparationlencoDomiciliDigitali",
    description: `Inserimento dati per la dataPreparation`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Response_Request_Digital_Address,
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
    path: "/inad-verification/data-preparation",
    alias: "getDataPreparationElencoDomiciliDigitali",
    description: `Recupero dati inseriti con la dataPreparation`,
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
    path: "/inad-verification/data-preparation",
    alias: "dataPreparationDeleteDomiciliDigitali",
    description: `Cancellazione di tutti i dati inseriti con la dataPreparation`,
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
    path: "/inad-verification/data-preparation/:codiceFiscale",
    alias: "getDataPreparationElencoDomiciliDigitaliDetails",
    description: `Recupero dati inseriti con la dataPreparation`,
    requestFormat: "json",
    parameters: [
      {
        name: "codiceFiscale",
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
    path: "/inad-verification/data-preparation/:codiceFiscale",
    alias: "deleteDataPreparationElencoDomiciliDigitali",
    description: `Cancellazione dei dati inseriti con la dataPreparation per il codice fiscale specificato`,
    requestFormat: "json",
    parameters: [
      {
        name: "codiceFiscale",
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
    method: "get",
    path: "/inad-verification/extract/:codice_fiscale",
    alias: "recuperoDomicilioDigitale",
    description: `Consente di ottenere il domicilio digitale corrispondente al codice fiscale al momento della consultazione e, in caso di domicilio digitale eletto in qualità di Professionista, anche l&#x27;attività professionale esercitata.`,
    requestFormat: "json",
    parameters: [
      {
        name: "codice_fiscale",
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
    method: "post",
    path: "/inad-verification/listDigitalAddress",
    alias: "richiestaElencoDomiciliDigitali",
    description: `Consente di inserire una richiesta di estrazione di domicili digitali a partire dall&#x27;elenco di codici fiscali forniti (fino ad un massimo di 1.000). Per ogni codice fiscale si ottiene il domicilio digitale corrispondente al momento dell&#x27;estrazione e, in caso di domicilio digitale eletto in qualità di Professionista, anche l&#x27;attività professionale esercitata. L&#x27;elaborazione della richiesta è asincrona. L&#x27;elenco, identificato da un codice univoco, è reso disponibile mediante un servizio di recupero.`,
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
    path: "/inad-verification/listDigitalAddress/response/:id",
    alias: "recuperoElencoDomiciliDigitali",
    description: `Consente di recuperare l&#x27;elenco dei domicili digitali individuato dal codice identificativo univoco.`,
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
    path: "/inad-verification/listDigitalAddress/state/:id",
    alias: "verificaStatoRichiestaElencoDomiciliDigitali",
    description: `Consente di verificare lo stato del processamento della richiesta dell&#x27;elenco dei domicili digitali individuato dal codice identificativo univoco.`,
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
        description: `JSON di risposta attraverso il quale l&#x27;Erogatore indica, sulla base dello stato del processamento, che l&#x27;elenco è pronto all&#x27;URL indicato nell&#x27;&lt;i&gt;HTTP header Location&lt;/i&gt;.`,
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
    path: "/inad-verification/status",
    alias: "get_status",
    description: `Ritorna lo stato dell&#x27;applicazione: 200 se funziona correttamente
o un errore se l&#x27;applicazione è temporaneamente indisponibile
per manutenzione o per un problema tecnico.
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
    path: "/inad-verification/verify/:codice_fiscale",
    alias: "verificaDomicilioDigitale",
    description: `Fornito in input il domicilio digitale, codice fiscale e data, il servizio consente di verificare se, alla data indicata, il domicilio digitale era associato al codice fiscale indicato.`,
    requestFormat: "json",
    parameters: [
      {
        name: "codice_fiscale",
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
        name: "since",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "practicalReference",
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

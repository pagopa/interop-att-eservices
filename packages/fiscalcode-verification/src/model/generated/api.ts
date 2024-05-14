import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const CodiceFiscale = z.string();
const DatapreparationTemplate = z
  .object({
    codiceFiscale: CodiceFiscale.min(11)
      .max(16)
      .regex(
        /^[0-9]{11}|(?:^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$)/
      ),
  })
  .partial()
  .passthrough();
const DataPreparationResponse = z.array(
  z
    .object({
      codiceFiscale: CodiceFiscale.min(11)
        .max(16)
        .regex(
          /^[0-9]{11}|(?:^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$)/
        ),
    })
    .partial()
    .passthrough()
);
const post_verifica_codiceFiscale_Body = z
  .object({
    certificate: z.instanceof(File),
    content: z.object({ content: z.unknown() }).partial().passthrough(),
  })
  .partial()
  .passthrough();
const VerificaCodiceFiscale = z
  .object({
    codiceFiscale: CodiceFiscale.min(11)
      .max(16)
      .regex(
        /^[0-9]{11}|(?:^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$)/
      ),
    valido: z.boolean(),
    messaggio: z.string(),
  })
  .partial()
  .passthrough();

export const schemas = {
  CodiceFiscale,
  DatapreparationTemplate,
  DataPreparationResponse,
  post_verifica_codiceFiscale_Body,
  VerificaCodiceFiscale,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/fiscalcode-verification/data-preparation",
    alias: "postFiscalcodeVerificationdataPreparation",
    description: `carica il codice fiscale valido`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: DatapreparationTemplate,
      },
      {
        name: "apikey",
        type: "Header",
        schema: z.string(),
      },
      {
        name: "x-correlation-id",
        type: "Header",
        schema: z.string(),
      },
    ],
    response: z.object({ message: z.string() }).partial().passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/fiscalcode-verification/data-preparation/all",
    alias: "getFiscalcodeVerificationdataPreparationall",
    description: `carica il codice fiscale valido`,
    requestFormat: "json",
    parameters: [
      {
        name: "apikey",
        type: "Header",
        schema: z.string(),
      },
      {
        name: "x-correlation-id",
        type: "Header",
        schema: z.string(),
      },
    ],
    response: DataPreparationResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/fiscalcode-verification/data-preparation/handshake",
    alias: "postFiscalcodeVerificationdataPreparationhandshake",
    description: `Carica il certificato nel formato .pem insieme a due campi nell&#x27;header.`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ certificate: z.instanceof(File) })
          .partial()
          .passthrough(),
      },
      {
        name: "apikey",
        type: "Header",
        schema: z.string(),
      },
    ],
    response: z.object({ message: z.string() }).partial().passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/fiscalcode-verification/data-preparation/remove",
    alias: "postFiscalcodeVerificationdataPreparationremove",
    description: `carica il codice fiscale valido`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: DatapreparationTemplate,
      },
      {
        name: "apikey",
        type: "Header",
        schema: z.string(),
      },
      {
        name: "x-correlation-id",
        type: "Header",
        schema: z.string(),
      },
    ],
    response: z.object({ message: z.string() }).partial().passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/fiscalcode-verification/data-preparation/reset",
    alias: "reset",
    description: `Ritorna lo stato dell&#x27;applicazione: 200 se funziona correttamente
o un errore se l&#x27;applicazione è temporaneamente indisponibile
per manutenzione o per un problema tecnico.
`,
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Not authorized`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too many requests`,
        schema: z.void(),
      },
      {
        status: 503,
        description: `Service Unavailable`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/fiscalcode-verification/status",
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
        description: `Bad Request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Not authorized`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too many requests`,
        schema: z.void(),
      },
      {
        status: 503,
        description: `Service Unavailable`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/fiscalcode-verification/verifica",
    alias: "post_verifica_codiceFiscale",
    description: `Ritorna informazioni circa la validità del codice fiscale in input
`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: post_verifica_codiceFiscale_Body,
      },
    ],
    response: VerificaCodiceFiscale,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Not authorized`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too many requests`,
        schema: z.void(),
      },
      {
        status: 503,
        description: `Service Unavailable`,
        schema: z.void(),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}

import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const CodiceFiscale = z.string();
const DatapreparationTemplate = z
  .object({
    idSubject: CodiceFiscale.min(11)
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
      idSubject: CodiceFiscale.min(11)
        .max(16)
        .regex(
          /^[0-9]{11}|(?:^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$)/
        ),
    })
    .partial()
    .passthrough()
);
const Richiesta = z
  .object({
    idSubject: CodiceFiscale.min(11)
      .max(16)
      .regex(
        /^[0-9]{11}|(?:^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$)/
      ),
  })
  .partial()
  .passthrough();
const VerificaCodiceFiscale = z
  .object({
    idSubject: CodiceFiscale.min(11)
      .max(16)
      .regex(
        /^[0-9]{11}|(?:^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$)/
      ),
    valid: z.boolean(),
    message: z.string(),
  })
  .partial()
  .passthrough();

export const schemas = {
  CodiceFiscale,
  DatapreparationTemplate,
  DataPreparationResponse,
  Richiesta,
  VerificaCodiceFiscale,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/fiscalcode-verification/check",
    alias: "post_verifica_codiceFiscale",
    description: `Returns information about the validity of the input subject id
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Richiesta,
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
  {
    method: "post",
    path: "/fiscalcode-verification/data-preparation",
    alias: "postFiscalcodeVerificationdataPreparation",
    description: `upload your valid subject id`,
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
    path: "/fiscalcode-verification/data-preparation",
    alias: "getFiscalcodeVerificationdataPreparation",
    description: `upload the valid subject id`,
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
    method: "delete",
    path: "/fiscalcode-verification/data-preparation",
    alias: "reset",
    description: `Returns: 200 if successfully cleared.
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
    path: "/fiscalcode-verification/data-preparation/handshake",
    alias: "postFiscalcodeVerificationdataPreparationhandshake",
    description: `Upload the certificate in .pem format along with two fields in the header.`,
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
    description: `deletes a previously entered subject id`,
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
    path: "/fiscalcode-verification/status",
    alias: "get_status",
    description: `Returns the application status: 200 if it is working correctly
or an error if the application is temporarily unavailable
for maintenance or a technical problem.
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
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}

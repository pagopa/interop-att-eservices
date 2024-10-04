import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const OrganizationId = z.string();
const DatapreparationTemplate = z
  .object({
    organizationId: OrganizationId.min(11)
      .max(11)
      .regex(/^[0-9]+/),
  })
  .partial()
  .passthrough();
const DataPreparationResponse = z.array(
  z
    .object({
      organizationId: OrganizationId.min(11)
        .max(11)
        .regex(/^[0-9]+/),
    })
    .partial()
    .passthrough()
);
const Richiesta = z
  .object({
    organizationId: OrganizationId.min(11)
      .max(11)
      .regex(/^[0-9]+/),
  })
  .partial()
  .passthrough();
const VerificaOrganizationId = z
  .object({
    organizationId: OrganizationId.min(11)
      .max(11)
      .regex(/^[0-9]+/),
    valid: z.boolean(),
    status: z.enum(["ATTIVA", "CESSATA", "SOSPESA"]),
    denomination: z.string(),
    dateStartActivity: z.string(),
    dateEndActivity: z.string(),
    dateStartSuspension: z.string(),
    isOrganizationId: z.boolean(),
    organizationGroupId: OrganizationId.min(11)
      .max(11)
      .regex(/^[0-9]+/),
    dateStartPartecipationOrganizationGroupId: z.string(),
    isPartecipantOrganizationGroupId: z.boolean(),
  })
  .partial()
  .passthrough();

export const schemas = {
  OrganizationId,
  DatapreparationTemplate,
  DataPreparationResponse,
  Richiesta,
  VerificaOrganizationId,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/organizationid-verification/check",
    alias: "post_partita_organizationId",
    description: `Returns information on the validity of the organizationId
and if successful, some personal information is added.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Richiesta,
      },
    ],
    response: VerificaOrganizationId,
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
        status: 500,
        description: `Service Unavailable`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/organizationid-verification/data-preparation",
    alias: "postOrganizationidVerificationdataPreparation",
    description: `Upload your organization&#x27;s use cases`,
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
    path: "/organizationid-verification/data-preparation",
    alias: "getOrganizationidVerificationdataPreparation",
    description: `List of institution use cases`,
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
    path: "/organizationid-verification/data-preparation",
    alias: "reset",
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
        status: 500,
        description: `Service Unavailable`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/organizationid-verification/data-preparation/handshake",
    alias: "postOrganizationidVerificationdataPreparationhandshake",
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
    path: "/organizationid-verification/data-preparation/remove",
    alias: "postOrganizationidVerificationdataPreparationremove",
    description: `It removes a specific use case`,
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
    path: "/organizationid-verification/status",
    alias: "get_status",
    description: `Returns the application status: 200 if it is working correctly
or an error if the application is temporarily unavailable
for maintenance or a technical problem.
`,
    requestFormat: "json",
    response: z.void(),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}

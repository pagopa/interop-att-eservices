import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const Event = z
  .object({
    eventId: z.number().int(),
    eventType: z.string(),
    objectType: z.string(),
    objectId: z.record(z.string()),
  })
  .passthrough();
const Events = z
  .object({ lastEventId: z.number().int().optional(), events: z.array(Event) })
  .passthrough();
const AgreementState = z.enum([
  "PENDING",
  "ACTIVE",
  "SUSPENDED",
  "ARCHIVED",
  "MISSING_CERTIFIED_ATTRIBUTES",
  "REJECTED",
]);
const Agreement = z.object({
  id: z.string().uuid(),
  eserviceId: z.string().uuid(),
  descriptorId: z.string().uuid(),
  producerId: z.string().uuid(),
  consumerId: z.string().uuid(),
  state: AgreementState,
});
const PurposeState = z.enum([
  "ACTIVE",
  "DRAFT",
  "SUSPENDED",
  "WAITING_FOR_APPROVAL",
  "ARCHIVED",
]);
const Purpose = z.object({
  id: z.string().uuid(),
  throughput: z.number().int(),
  state: PurposeState,
});
const AttributeSeed = z.object({
  code: z
    .string()
    .min(2)
    .max(16)
    .regex(/^[a-zA-Z0-9\-_]+$/),
  name: z
    .string()
    .min(2)
    .max(24)
    .regex(/^[a-zA-Z0-9\s\-_]+$/),
  description: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-zA-Z0-9\s\-_\.,;\:]+$/),
});
const AttributeKind = z.enum(["CERTIFIED", "DECLARED", "VERIFIED"]);
const Attribute = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(2)
    .max(16)
    .regex(/^[a-zA-Z0-9\s\-_]+$/),
  kind: AttributeKind,
});
const Client = z.object({
  id: z.string().uuid(),
  consumerId: z.string().uuid(),
});
const Origin = z.string();
const ExternalId = z.object({ origin: Origin, id: z.string() }).passthrough();
const Organization = z.object({
  id: z.string().uuid(),
  externalId: ExternalId,
  name: z.string(),
  category: z.string(),
});
const EServiceTechnology = z.enum(["REST", "SOAP"]);
const EServiceAttributeValue = z
  .object({
    id: z.string().uuid(),
    code: z
      .string()
      .max(48)
      .regex(/[a-z0-9 \-]{,48}/),
    origin: Origin,
    explicitAttributeVerification: z.boolean(),
  })
  .passthrough();
const EServiceAttribute = z
  .object({
    single: EServiceAttributeValue,
    group: z.array(EServiceAttributeValue),
  })
  .partial()
  .passthrough();
const EServiceAttributes = z
  .object({
    certified: z.array(EServiceAttribute),
    declared: z.array(EServiceAttribute),
    verified: z.array(EServiceAttribute),
  })
  .passthrough();
const EServiceDescriptorState = z.enum([
  "PUBLISHED",
  "DEPRECATED",
  "SUSPENDED",
  "ARCHIVED",
]);
const EService = z
  .object({
    id: z.string().uuid(),
    producer: Organization,
    name: z.string(),
    version: z.string().regex(/^[0-9]{1,4}$/),
    description: z.string(),
    technology: EServiceTechnology,
    attributes: EServiceAttributes,
    state: EServiceDescriptorState,
    serverUrls: z.array(z.string()),
  })
  .passthrough();
const EServiceDoc = z
  .object({ id: z.string().uuid(), name: z.string(), contentType: z.string() })
  .passthrough();
const EServiceDescriptor = z
  .object({
    id: z.string().uuid(),
    version: z.string(),
    description: z.string().optional(),
    audience: z.array(z.string()),
    voucherLifespan: z.number().int(),
    dailyCallsPerConsumer: z.number().int().gte(0),
    dailyCallsTotal: z.number().int().gte(0),
    interface: EServiceDoc.optional(),
    docs: z.array(EServiceDoc),
    state: EServiceDescriptorState,
    serverUrls: z.array(z.string()),
  })
  .passthrough();
const EServiceDescriptors = z
  .object({ descriptors: z.array(EServiceDescriptor) })
  .passthrough();
const Agreements = z.object({ agreements: z.array(Agreement) }).passthrough();
const OtherPrimeInfo = z
  .object({ r: z.string(), d: z.string(), t: z.string() })
  .passthrough();
const JWK = z
  .object({
    kty: z.string(),
    key_ops: z.array(z.string()).optional(),
    use: z.string().optional(),
    alg: z.string().optional(),
    kid: z.string(),
    x5u: z.string().min(1).optional(),
    x5t: z.string().optional(),
    "x5t#S256": z.string().optional(),
    x5c: z.array(z.string()).optional(),
    crv: z.string().optional(),
    x: z.string().optional(),
    y: z.string().optional(),
    d: z.string().optional(),
    k: z.string().optional(),
    n: z.string().optional(),
    e: z.string().optional(),
    p: z.string().optional(),
    q: z.string().optional(),
    dp: z.string().optional(),
    dq: z.string().optional(),
    qi: z.string().optional(),
    oth: z.array(OtherPrimeInfo).min(1).optional(),
  })
  .passthrough();
const Purposes = z.object({ purposes: z.array(Purpose) }).passthrough();
const AttributeValidity = z.enum(["VALID", "INVALID"]);
const AttributeValidityState = z.object({
  id: z.string().uuid(),
  validity: AttributeValidity,
});
const Attributes = z
  .object({
    verified: z.array(AttributeValidityState),
    certified: z.array(AttributeValidityState),
    declared: z.array(AttributeValidityState),
  })
  .passthrough();
const EServices = z.object({ eservices: z.array(EService) }).passthrough();

export const schemas = {
  Event,
  Events,
  AgreementState,
  Agreement,
  PurposeState,
  Purpose,
  AttributeSeed,
  AttributeKind,
  Attribute,
  Client,
  Origin,
  ExternalId,
  Organization,
  EServiceTechnology,
  EServiceAttributeValue,
  EServiceAttribute,
  EServiceAttributes,
  EServiceDescriptorState,
  EService,
  EServiceDoc,
  EServiceDescriptor,
  EServiceDescriptors,
  Agreements,
  OtherPrimeInfo,
  JWK,
  Purposes,
  AttributeValidity,
  AttributeValidityState,
  Attributes,
  EServices,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/agreements",
    alias: "getAgreements",
    description: `It is mandatory to insert either the producerId field or the consumerId field.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "producerId",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "consumerId",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "eserviceId",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "descriptorId",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "states",
        type: "Query",
        schema: z.array(AgreementState).optional().default([]),
      },
    ],
    response: Agreements,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/agreements/:agreementId",
    alias: "getAgreement",
    description: `Retrieve an agreement using an agreement identifier`,
    requestFormat: "json",
    parameters: [
      {
        name: "agreementId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Agreement,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Agreement not found`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/agreements/:agreementId/attributes",
    alias: "getAgreementAttributes",
    description: `Retrieve attributes of the agreement`,
    requestFormat: "json",
    parameters: [
      {
        name: "agreementId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Attributes,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Purposes not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/agreements/:agreementId/purposes",
    alias: "getAgreementPurposes",
    description: `Retrieve purposes of the agreement`,
    requestFormat: "json",
    parameters: [
      {
        name: "agreementId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Purposes,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Purposes not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/attributes",
    alias: "createCertifiedAttribute",
    description: `Creates an attribute if the caller is a certifier`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AttributeSeed,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 409,
        description: `Conflict`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/attributes/:attributeId",
    alias: "getAttribute",
    description: `Retrieve an attribute using an attribute identifier`,
    requestFormat: "json",
    parameters: [
      {
        name: "attributeId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Attribute,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Attribute not found`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/clients/:clientId",
    alias: "getClient",
    description: `Retrieve a client using a client identifier`,
    requestFormat: "json",
    parameters: [
      {
        name: "clientId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Client,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Client not found`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/eservices/:eserviceId",
    alias: "getEService",
    description: `Get the eservice by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "eserviceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: EService,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/eservices/:eserviceId/descriptors",
    alias: "getEServiceDescriptors",
    description: `Get the eservice descriptors by eservice ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "eserviceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: EServiceDescriptors,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/eservices/:eserviceId/descriptors/:descriptorId",
    alias: "getEServiceDescriptor",
    description: `Retrieve an eservice descriptor by identifiers`,
    requestFormat: "json",
    parameters: [
      {
        name: "eserviceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "descriptorId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: EServiceDescriptor,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `EService not found`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/events",
    alias: "getEventsFromId",
    description: `Retrieves the list of events for the caller&#x27;s institution`,
    requestFormat: "json",
    parameters: [
      {
        name: "lastEventId",
        type: "Query",
        schema: z.number().int(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(500).optional().default(100),
      },
    ],
    response: Events,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/events/agreements",
    alias: "getAgreementsEventsFromId",
    description: `Retrieves the list of agreements events`,
    requestFormat: "json",
    parameters: [
      {
        name: "lastEventId",
        type: "Query",
        schema: z.number().int(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(500).optional().default(100),
      },
    ],
    response: Events,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/events/eservices",
    alias: "getEservicesEventsFromId",
    description: `Retrieves the list of eservices events`,
    requestFormat: "json",
    parameters: [
      {
        name: "lastEventId",
        type: "Query",
        schema: z.number().int(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(500).optional().default(100),
      },
    ],
    response: Events,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/events/keys",
    alias: "getKeysEventsFromId",
    description: `Retrieves the list of keys events`,
    requestFormat: "json",
    parameters: [
      {
        name: "lastEventId",
        type: "Query",
        schema: z.number().int(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(500).optional().default(100),
      },
    ],
    response: Events,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/keys/:kid",
    alias: "getJWKByKid",
    description: `Retrieve the JWK by kid`,
    requestFormat: "json",
    parameters: [
      {
        name: "kid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: JWK,
    errors: [
      {
        status: 404,
        description: `Key not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/organizations/:organizationId",
    alias: "getOrganization",
    description: `Retrieve an organization by identifier`,
    requestFormat: "json",
    parameters: [
      {
        name: "organizationId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Organization,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Organization not found`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/organizations/origin/:origin/externalId/:externalId/attributes/:code",
    alias: "upsertTenant",
    description: `Upserts the Tenant`,
    requestFormat: "json",
    parameters: [
      {
        name: "origin",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "externalId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "code",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/organizations/origin/:origin/externalId/:externalId/attributes/:code",
    alias: "revokeTenantAttribute",
    description: `Revokes a Tenant attribute`,
    requestFormat: "json",
    parameters: [
      {
        name: "origin",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "externalId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "code",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/organizations/origin/:origin/externalId/:externalId/eservices",
    alias: "getOrganizationEServices",
    description: `Retrieve EServices for a given Organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "origin",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "externalId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "attributeOrigin",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "attributeCode",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: EServices,
    errors: [
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/purposes/:purposeId",
    alias: "getPurpose",
    description: `Retrieve a purpose using a purpose identifier`,
    requestFormat: "json",
    parameters: [
      {
        name: "purposeId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Purpose,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Purpose not found`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/purposes/:purposeId/agreement",
    alias: "getAgreementByPurpose",
    description: `Retrieve the agreement associated to a purpose`,
    requestFormat: "json",
    parameters: [
      {
        name: "purposeId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Agreement,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Agreement not found`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/status",
    alias: "get_status",
    description: `Returns the application status. For testing purposes, it might randomly reply with an error.
`,
    requestFormat: "json",
    response: z.void(),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}

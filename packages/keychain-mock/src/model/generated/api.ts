import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const SuccessResponseSignature = z
  .object({ message: z.string() })
  .partial()
  .passthrough();
const InputMessage = z.object({ message: z.string() }).partial().passthrough();
const VerificationResponse = z
  .object({ status: z.string(), message: z.string() })
  .partial()
  .passthrough();

export const schemas = {
  SuccessResponseSignature,
  InputMessage,
  VerificationResponse,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/keychain-mock/signature",
    alias: "get_signature",
    description: `Returns response with signature
`,
    requestFormat: "json",
    response: z.object({ message: z.string() }).partial().passthrough(),
    errors: [
      {
        status: NaN,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/keychain-mock/status",
    alias: "get_status",
    description: `Returns the application status: 200 if it is working correctly
or an error if the application is temporarily unavailable
for maintenance or a technical problem.
`,
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: NaN,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/keychain-mock/verify",
    alias: "post_verify_message",
    description: `This endpoint takes a message input and returns a status indicating
whether the message verification was successful or not.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ message: z.string() }).partial().passthrough(),
      },
    ],
    response: VerificationResponse,
    errors: [
      {
        status: NaN,
        schema: z.void(),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}

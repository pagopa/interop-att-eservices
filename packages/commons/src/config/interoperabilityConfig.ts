import { z } from "zod";

export const InteroperabilityConfig = z.preprocess(
  (c) =>
    (c as { SKIP_INTEROPERABILITY_VERIFICATION?: string })
      .SKIP_INTEROPERABILITY_VERIFICATION === undefined
      ? { ...(c as object), SKIP_INTEROPERABILITY_VERIFICATION: "true" }
      : c,

  z
    .discriminatedUnion("SKIP_INTEROPERABILITY_VERIFICATION", [
      z.object({
        SKIP_INTEROPERABILITY_VERIFICATION: z.literal("true"),
      }),

      z.object({
        SKIP_INTEROPERABILITY_VERIFICATION: z.literal("false"),
        TOKEN_INTEROPERABILITY_SUBJECT: z.string(),
        TOKEN_INTEROPERABILITY_AUDIENCE: z.string(),
        TOKEN_INTEROPERABILITY_ISSUER: z.string(),
        TOKEN_INTEROPERABILITY_EXPIRATION_SECONDS: z.string(),
        TOKEN_INTEROPERABILITY_HOST: z.string(),
        TOKEN_INTEROPERABILITY_KID: z.string(),
        TOKEN_FROM_ACCESS_CODE: z.string(),
      }),
    ])
    .transform((c) =>
      c.SKIP_INTEROPERABILITY_VERIFICATION === "false"
        ? {
            skipInteroperabilityVerification: false as const,
            subject: c.TOKEN_INTEROPERABILITY_SUBJECT,
            audience: c.TOKEN_INTEROPERABILITY_AUDIENCE,
            issuer: c.TOKEN_INTEROPERABILITY_ISSUER,
            expirationInSeconds: c.TOKEN_INTEROPERABILITY_EXPIRATION_SECONDS,
            host: c.TOKEN_INTEROPERABILITY_HOST,
            kid: c.TOKEN_INTEROPERABILITY_KID,
            tokenGenerateHost: c.TOKEN_FROM_ACCESS_CODE,
          }
        : {
            skipInteroperabilityVerification: true as const,
          }
    )
);

export type InteroperabilityConfig = z.infer<typeof InteroperabilityConfig>;

export const interoperabilityConfig = (): InteroperabilityConfig =>
  InteroperabilityConfig.parse(process.env);

import { z } from "zod";

const EnvBoolean = z.enum(["true", "false"]).transform((v) => v === "true");

const SkippedSchema = z.object({
  SKIP_INTEROPERABILITY_VERIFICATION: z.literal("true"),
  SKIP_AGID_PAYLOAD_VERIFICATION: EnvBoolean.default("false"),
  TOKEN_AUD: z.string().default(""),
});

const ActiveSchema = z.object({
  SKIP_INTEROPERABILITY_VERIFICATION: z.literal("false"),
  SKIP_AGID_PAYLOAD_VERIFICATION: EnvBoolean.default("false"),
  TOKEN_INTEROPERABILITY_SUBJECT: z.string(),
  TOKEN_INTEROPERABILITY_AUDIENCE: z.string(),
  TOKEN_INTEROPERABILITY_ISSUER: z.string(),
  TOKEN_INTEROPERABILITY_EXPIRATION_SECONDS: z.string(),
  TOKEN_INTEROPERABILITY_HOST: z.string(),
  TOKEN_INTEROPERABILITY_KID: z.string(),
  TOKEN_FROM_ACCESS_CODE: z.string(),
  TOKEN_AUD: z.string().default(""),
});

export const InteroperabilityConfig = z
  .discriminatedUnion("SKIP_INTEROPERABILITY_VERIFICATION", [
    SkippedSchema,
    ActiveSchema,
  ])
  .transform((c) => {
    if (c.SKIP_INTEROPERABILITY_VERIFICATION === "true") {
      return {
        skipInteroperabilityVerification: true as const,
        skipAgidPayloadVerification: c.SKIP_AGID_PAYLOAD_VERIFICATION,
        tokenAud: c.TOKEN_AUD,
      };
    }

    return {
      skipInteroperabilityVerification: false as const,
      skipAgidPayloadVerification: c.SKIP_AGID_PAYLOAD_VERIFICATION,
      subject: c.TOKEN_INTEROPERABILITY_SUBJECT,
      audience: c.TOKEN_INTEROPERABILITY_AUDIENCE,
      issuer: c.TOKEN_INTEROPERABILITY_ISSUER,
      expirationInSeconds: c.TOKEN_INTEROPERABILITY_EXPIRATION_SECONDS,
      host: c.TOKEN_INTEROPERABILITY_HOST,
      kid: c.TOKEN_INTEROPERABILITY_KID,
      tokenGenerateHost: c.TOKEN_FROM_ACCESS_CODE,
      tokenAud: c.TOKEN_AUD,
    };
  });

export type InteroperabilityConfig = z.infer<typeof InteroperabilityConfig>;

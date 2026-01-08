import { z } from "zod";
import { APIEndpoint } from "../model/apiEndpoint.js";

export const JWTSeedConfig = z
  .object({
    GENERATED_JWT_SUBJECT: z.string(),
    GENERATED_JWT_AUDIENCE: z.string().transform((v) => v.split(",")),
    GENERATED_JWT_ISSUER: z.string(),
    GENERATED_JWT_SECONDS_TO_EXPIRE: z.coerce.number(),
  })
  .transform((c) => ({
    subject: c.GENERATED_JWT_SUBJECT,
    audience: c.GENERATED_JWT_AUDIENCE,
    tokenIssuer: c.GENERATED_JWT_ISSUER,
    secondsToExpire: c.GENERATED_JWT_SECONDS_TO_EXPIRE,
  }));

export type JWTSeedConfig = z.infer<typeof JWTSeedConfig>;

export const JWTConfig = z.preprocess(
  (c) => {
    const conf = c as {
      SKIP_JWT_VERIFICATION?: string;
      SKIP_DIGEST_CHECK?: string;
    };
    return {
      ...(conf as object),
      SKIP_JWT_VERIFICATION: conf.SKIP_JWT_VERIFICATION ?? "false",
      SKIP_DIGEST_CHECK: conf.SKIP_DIGEST_CHECK ?? "false",
    };
  },

  z
    .discriminatedUnion("SKIP_JWT_VERIFICATION", [
      z.object({
        SKIP_JWT_VERIFICATION: z.literal("true"),
      }),

      z.object({
        SKIP_JWT_VERIFICATION: z.literal("false"),
        SKIP_DIGEST_CHECK: z
          .enum(["true", "false"])
          .transform((value) => value === "true")
          .default("false"),
        WELL_KNOWN_URLS: z
          .string()
          .transform((s) => s.split(","))
          .pipe(z.array(APIEndpoint)),
        TOKEN_ISS: z.string(),
        TOKEN_AUD: z.string(),
        TOKEN_TYP: z.string(),
      }),
    ])
    .transform((c) =>
      c.SKIP_JWT_VERIFICATION === "false"
        ? {
            skipJWTVerification: false as const,
            skipDigestCheck: c.SKIP_DIGEST_CHECK,
            wellKnownUrls: c.WELL_KNOWN_URLS,
            issValue: c.TOKEN_ISS,
            audValue: c.TOKEN_AUD,
            typValue: c.TOKEN_TYP,
          }
        : {
            skipJWTVerification: true as const,
          }
    )
);

export type JWTConfig = z.infer<typeof JWTConfig>;

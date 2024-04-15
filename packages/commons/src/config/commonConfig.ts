import { z } from "zod";
import { APIEndpoint } from "../model/apiEndpoint.js";

export const JWTConfig = z.preprocess(
  (c) =>
    (c as { SKIP_JWT_VERIFICATION: string | undefined })
      .SKIP_JWT_VERIFICATION === undefined
      ? { ...(c as object), SKIP_JWT_VERIFICATION: "false" }
      : c,

  z
    .discriminatedUnion("SKIP_JWT_VERIFICATION", [
      z.object({
        SKIP_JWT_VERIFICATION: z.literal("true"),
      }),
      z.object({
        SKIP_JWT_VERIFICATION: z.literal("false"),
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




export const InteroperabilityConfig = z.preprocess(
  (c) =>
    (c as { SKIP_INTEROPERABILITY_VERIFICATION: string | undefined })
      .SKIP_INTEROPERABILITY_VERIFICATION === undefined
      ? { ...(c as object), SKIP_INTEROPERABILITY_VERIFICATION: "false" }
      : c,

  z
    .discriminatedUnion("SKIP_INTEROPERABILITY_VERIFICATION", [
      z.object({
        SKIP_INTEROPERABILITY_VERIFICATION: z.literal("true"),
      }),
      z.object({
        SKIP_INTEROPERABILITY_VERIFICATION: z.literal("false"),
        TOKEN_INTEROPERABILITY_SUBJECT: z
          .string(),
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
          kid : c.TOKEN_INTEROPERABILITY_HOST, 
          tokenGenerateHost : c.TOKEN_FROM_ACCESS_CODE
          }
        : {
          skipInteroperabilityVerification: true as const,
          }
    )
);
export type InteroperabilityConfig = z.infer<typeof InteroperabilityConfig>;


export const LoggerConfig = z
  .object({
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
  })
  .transform((c) => ({
    logLevel: c.LOG_LEVEL,
  }));
export type LoggerConfig = z.infer<typeof LoggerConfig>;

export const HTTPServerConfig = z
  .object({
    HOST: APIEndpoint,
    PORT: z.coerce.number().min(1001),
  })
  .transform((c) => ({
    host: c.HOST,
    port: c.PORT,
  }));
export type HTTPServerConfig = z.infer<typeof HTTPServerConfig>;

export const CommonConfig = HTTPServerConfig.and(LoggerConfig).and(JWTConfig);
export type CommonConfig = z.infer<typeof CommonConfig>;

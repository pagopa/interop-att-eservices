import { z } from "zod";

export const SkipDigestConfig = z
  .object({
    SKIP_INTEROPERABILITY_VERIFICATION: z.enum(["true", "false"]).optional(),
    SKIP_AGID_PAYLOAD_VERIFICATION: z.enum(["true", "false"]).optional(),
  })
  .refine(
    (c) =>
      c.SKIP_INTEROPERABILITY_VERIFICATION !== undefined ||
      c.SKIP_AGID_PAYLOAD_VERIFICATION !== undefined,
    {
      message:
        "At least one of SKIP_INTEROPERABILITY_VERIFICATION or SKIP_AGID_PAYLOAD_VERIFICATION must be provided",
      path: ["SKIP_INTEROPERABILITY_VERIFICATION"],
    }
  )
  .transform((c) => ({
    skipInteroperabilityVerification:
      c.SKIP_INTEROPERABILITY_VERIFICATION === "true",
    skipAgidPayloadVerification: c.SKIP_AGID_PAYLOAD_VERIFICATION === "true",
  }));

export type SkipDigestConfig = z.infer<typeof SkipDigestConfig>;

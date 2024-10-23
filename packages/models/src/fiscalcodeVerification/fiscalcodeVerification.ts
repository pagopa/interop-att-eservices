import { z } from "zod";

export const FiscalcodeModel = z.object({
  fiscalCode: z.string(),
});
export type FiscalcodeModel = z.infer<typeof FiscalcodeModel>;

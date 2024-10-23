import { z } from "zod";

export const PartitaIvaModel = z.object({
  organizationId: z.string(),
});
export type PartitaIvaModel = z.infer<typeof PartitaIvaModel>;

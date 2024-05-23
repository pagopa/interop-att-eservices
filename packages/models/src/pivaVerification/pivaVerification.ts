import { z } from "zod";

export const PartitaIvaModel = z.object({
  partitaIva: z.string(),
});
export type PartitaIvaModel = z.infer<typeof PartitaIvaModel>;

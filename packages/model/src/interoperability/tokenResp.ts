import { z } from "zod";

// Definisci lo schema per il formato della risposta del token
export const TokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string()
});

// Definisci il tipo TokenResponse utilizzando z.infer
export type TokenResponse = z.infer<typeof TokenResponseSchema>;
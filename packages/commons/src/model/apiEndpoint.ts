import { z } from "zod";

/*
questo codice definisce uno schema di validazione per un endpoint API, 
assicurandosi che sia una stringa con almeno un carattere e rimuovendo eventuali caratteri di slash superflui alla fine. 
Aggiunge anche un tipo personalizzato "APIEndpoint" per identificare chiaramente l'endpoint API all'interno del codice TypeScript. */
export const APIEndpoint = z
  .string()
  .min(1)
  .transform((s) => s.replace(/\/+$/, ""))
  .brand<"APIEndpoint">();

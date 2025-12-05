import { z } from "zod";
import { HTTPServerConfig } from "pdnd-common";

export const FamilyStatusConfiguration = HTTPServerConfig;

export type FamilyStatusConfiguration = z.infer<
  typeof FamilyStatusConfiguration
>;

export const familyStatusConfiguration: FamilyStatusConfiguration =
  FamilyStatusConfiguration.parse(process.env);

import { JwtPayload } from "jsonwebtoken";
import { z } from "zod";

export const userRoles = {
  ADMIN_ROLE: "admin",
  SECURITY_ROLE: "security",
  API_ROLE: "api",
  M2M_ROLE: "m2m",
  INTERNAL_ROLE: "internal",
  SUPPORT_ROLE: "support",
} as const;

export const UserRoles = z.enum([
  Object.values(userRoles)[0],
  ...Object.values(userRoles).slice(1),
]);
export type UserRoles = z.infer<typeof UserRoles>;

export const AuthJWTToken = z.object({
  purposeId: z.string(),
  client_id: z.string(),
});
export type AuthJWTToken = z.infer<typeof AuthJWTToken> & JwtPayload;

export const AuthData = z.object({
  purposeId: z.string(),
  clientId: z.string(),
});
export type AuthData = z.infer<typeof AuthData>;

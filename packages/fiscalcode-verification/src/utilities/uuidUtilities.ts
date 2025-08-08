import { v4 as uuidv4 } from "uuid";

export function generateRandomUUID(existingUUID?: string): string {
  if (existingUUID && typeof existingUUID === "string") {
    return existingUUID;
  }

  return uuidv4();
}

export function isValidUUID(uuid: string): boolean {
  const UUIDRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return UUIDRegex.test(uuid);
}

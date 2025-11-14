/* eslint-disable no-console */
import * as jwt from "jsonwebtoken";
interface CustomTokenPayload {
  eserviceId: string;
}

export async function getEserviceIdFromToken(
  authorizationHeader: string
): Promise<string> {
  try {
    if (!authorizationHeader.startsWith("Bearer ")) {
      throw new Error(
        "Authorization header is missing or malformed (missing 'Bearer ')."
      );
    }
    const token = authorizationHeader.split(" ")[1]; // Extracts the pure token
    if (!token) {
      throw new Error("Token not present in header.");
    }
    const decodedPayload = jwt.decode(token) as CustomTokenPayload | null;

    console.log("[getEserviceIdFromToken] Decoded payload:", decodedPayload);

    if (typeof decodedPayload !== "object" || decodedPayload === null) {
      throw new Error("Token payload is invalid or null.");
    }

    const eserviceId = decodedPayload.eserviceId;

    if (!eserviceId || typeof eserviceId !== "string") {
      console.error(
        "[getEserviceIdFromToken] 'eserviceId' field not found or invalid in JWT token."
      );
      throw new Error("Invalid token payload or missing 'eserviceId'.");
    }

    return eserviceId;
  } catch (error) {
    const errorMessage = (error as Error).message || String(error);
    console.error(
      `[getEserviceIdFromToken] Error during JWT token decoding: ${errorMessage}`
    );
    throw new Error("Malformed or unreadable JWT token.");
  }
}

import { Request } from "express";
import { P, match } from "ts-pattern";
import { z } from "zod";
import { AuthData } from "pdnd-common";
import { readAuthDataFromJwtToken } from "pdnd-common";

export const HeadersResidenceVerification = z.object({
  authorization: z.string().nullish(),
  "x-correlation-id": z.string().nullish(),
  "agid-jwt-signature": z.string().nullish(),
  "agid-jwt-trackingevidence": z.string().nullish(),
});

export type HeadersResidenceVerification = z.infer<
  typeof HeadersResidenceVerification
>;

export const ParsedHeadersResidenceVerification = z
  .object({
    correlationId: z.string().uuid(),
    agidJtSignature: z.string(),
    agidJwtTrackingevidence: z.string(),
  })
  .and(AuthData);
export type ParsedHeadersResidenceVerification = z.infer<
  typeof ParsedHeadersResidenceVerification
>;

export const readHeadersResidenceVerification = (
  req: Request
): ParsedHeadersResidenceVerification | undefined => {
  try {
    const headers = HeadersResidenceVerification.parse(req.headers);
    return match(headers)
      .with(
        {
          authorization: P.string,
          "x-correlation-id": P.string,
          "agid-jwt-signature": P.string,
          "agid-jwt-trackingevidence": P.string,
        },
        (headers) => {
          const authorizationHeader = headers.authorization.split(" ");
          if (
            authorizationHeader.length !== 2 ||
            authorizationHeader[0] !== "Bearer"
          ) {
            return undefined;
          }

          const jwtToken = authorizationHeader[1];
          const authData = readAuthDataFromJwtToken(jwtToken);
          return match(authData)
            .with(P.instanceOf(Error), () => undefined)
            .otherwise((authData: AuthData) => ({
              ...authData,
              correlationId: headers["x-correlation-id"],
              agidJtSignature: headers["agid-jwt-signature"],
              agidJwtTrackingevidence: headers["agid-jwt-trackingevidence"],
            }));
        }
      )
      .otherwise(() => undefined);
  } catch (error) {
    return undefined;
  }
};

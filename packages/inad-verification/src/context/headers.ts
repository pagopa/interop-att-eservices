import { Request } from "express";
import { P, match } from "ts-pattern";
import { z } from "zod";
import { AuthData } from "pdnd-common";
import { readAuthDataFromJwtToken } from "pdnd-common";

export const HeadersInad = z.object({
  authorization: z.string().nullish(),
  "x-correlation-id": z.string().nullish(),
});

export type HeadersInad = z.infer<typeof HeadersInad>;

export const ParsedHeadersInad = z
  .object({
    correlationId: z.string().uuid(),
  })
  .and(AuthData);
export type ParsedHeadersInad = z.infer<typeof ParsedHeadersInad>;

export const readHeadersInad = (
  req: Request
): ParsedHeadersInad | undefined => {
  try {
    const headers = HeadersInad.parse(req.headers);
    return match(headers)
      .with(
        {
          authorization: P.string,
          "x-correlation-id": P.string,
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
            }));
        }
      )
      .otherwise(() => undefined);
  } catch (error) {
    return undefined;
  }
};

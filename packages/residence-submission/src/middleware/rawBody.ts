import type { Request, Response } from "express";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const rawBodySaver = function (
  req: Request,
  _res: Response,
  buf: Buffer
) {
  if (buf?.length) {
    // eslint-disable-next-line functional/immutable-data
    req.rawBody = buf.toString("utf8");
  }
};

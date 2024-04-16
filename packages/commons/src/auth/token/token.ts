import { Algorithm } from "jsonwebtoken";

export type InternalToken = {
  serialized: string;
  jti: string;
  iat: number;
  exp: number;
  nbf: number;
  expIn: number;
  alg: Algorithm;
  kid: string;
  aud: string;
  sub: string;
  iss: string;
};

export type CustomJWTClaims = Map<string, string>;

export type TokenPayload = {
  id: string;
  algorithm: Algorithm;
  kid: string;
  subject: string;
  issuer: string;
  issuedAt: number;
  nbf: number;
  expireAt: number;
  audience: string;
  customClaims: CustomJWTClaims;
};

export type TokenPayloadInternal = {
  subject: string;
  audience: string;
  tokenIssuer: string;
  expirationInSeconds: number;
};

export type TokenHeader = {
  alg: Algorithm;
  kid: string;
  typ: string;
};
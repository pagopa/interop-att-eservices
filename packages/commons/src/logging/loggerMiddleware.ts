/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/immutable-data */
import * as expressWinston from "express-winston";
import * as winston from "winston";
import { LoggerConfig } from "../config/loggerConfig.js";
import { getContext } from "../index.js";

export type SessionMetaData = {
  userId: string | undefined;
  organizationId: string | undefined;
  correlationId: string | undefined;
};

type LoggerState = {
  config: LoggerConfig;
  serviceName: string;
  loggerInstance: winston.Logger;
};

const defaultLogger = winston.createLogger({
  level: "info",
  transports: [new winston.transports.Console()],
  silent: true,
});

const state: LoggerState = {
  config: {
    logLevel: "info",
    loggerSilent: true,
    nodeEnv: "test",
  },
  serviceName: "app",
  loggerInstance: defaultLogger,
};

const getLoggerMetadata = (): SessionMetaData => {
  const appContext = getContext();
  return !appContext
    ? {
        userId: "",
        organizationId: "",
        correlationId: "",
      }
    : {
        userId: appContext.authData.clientId,
        organizationId: "",
        correlationId: appContext.correlationId,
      };
};

const logFormat = (
  msg: string,
  timestamp: string,
  level: string,
  userId: string | undefined,
  organizationId: string | undefined,
  correlationId: string | undefined,
  serviceName: string
) =>
  `${timestamp} ${level.toUpperCase()} [${serviceName}] - [UID=${userId}] [OID=${organizationId}] [CID=${correlationId}] ${msg}`;

export const customFormat = () =>
  winston.format.printf(({ level, message, timestamp }) => {
    const { userId, organizationId, correlationId } = getLoggerMetadata();
    const msg = (message as string).toString();
    const time = (timestamp ?? "").toString();
    const lines = msg
      .split("\n")
      .map((line: string) =>
        logFormat(
          line,
          time,
          level,
          userId,
          organizationId,
          correlationId,
          state.serviceName
        )
      );
    return lines.join("\n");
  });

export const initLogger = (config: LoggerConfig, serviceName: string) => {
  state.config = config;
  state.serviceName = serviceName;

  state.loggerInstance.configure({
    level: state.config.logLevel,
    transports: [
      new winston.transports.Console({
        stderrLevels: ["error"],
      }),
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.errors({ stack: true }),
      customFormat()
    ),
    silent: false,
  });

  return state.loggerInstance;
};

const getLoggerInstance = () => state.loggerInstance;

export const loggerMiddleware = () =>
  expressWinston.logger({
    winstonInstance: getLoggerInstance(),
    requestWhitelist:
      state.config.logLevel === "info" ? ["body", "headers", "query"] : [],
    ignoredRoutes: ["/status"],
    responseWhitelist:
      state.config.logLevel === "info"
        ? ["body", "statusCode", "statusMessage"]
        : [],
    meta: false,
    msg: (req, res) =>
      `Request ${req.method} ${req.url} - Response ${res.statusCode} ${res.statusMessage}`,
  });

export const logger = {
  info: (msg: string, ...meta: any[]) => getLoggerInstance().info(msg, ...meta),
  error: (msg: string, ...meta: any[]) =>
    getLoggerInstance().error(msg, ...meta),
  warn: (msg: string, ...meta: any[]) => getLoggerInstance().warn(msg, ...meta),
  debug: (msg: string, ...meta: any[]) =>
    getLoggerInstance().debug(msg, ...meta),
  log: (level: string, msg: string, ...meta: any[]) =>
    getLoggerInstance().log(level, msg, ...meta),
} as winston.Logger;

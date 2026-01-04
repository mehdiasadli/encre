import { env } from "@encre/env/server";
import pino from "pino";
import {
	fileTransport,
	prettyTransport,
	standardConsoleTransport,
} from "./config";

const isDev = env.NODE_ENV === "development";

export const logger = pino({
	level: env.LOG_LEVEL ?? (isDev ? "debug" : "info"),

	redact: [
		"req.headers.authorization",
		"user.password",
		"user.newPassword",
		"user.twoFactorSecret",
		"user.confirmPassword",
		"user.confirmNewPassword",
		"polar.client_secret",
		"polar.api_key",
		"metadata.credit_card",
	],

	transport: {
		targets: isDev
			? [prettyTransport, fileTransport]
			: [fileTransport, standardConsoleTransport],
	},
});

export type Logger = typeof logger;

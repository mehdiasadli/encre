import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		// Application
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		// Database
		DATABASE_URL: z.string().min(1),
		// Auth
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		// CORS
		CORS_ORIGIN: z.url(),
		// Logging
		LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]),
		// Preferences
		MAX_COMMENT_DEPTH: z.coerce.number().int().min(1).max(10).default(5),
		MAX_PLACE_DEPTH: z.coerce.number().int().min(1).max(10).default(5),

		MAX_SERIES_PER_AUTHOR: z.coerce.number().int().positive(),
		MAX_BOOKS_PER_SERIE: z.coerce.number().int().positive(),
		MAX_CHARACTERS_PER_SERIE: z.coerce.number().int().positive(),
		MAX_CHAPTERS_PER_BOOK: z.coerce.number().int().positive(),
		// CLIENT
		NEXT_PUBLIC_BASE_URL: z.url(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});

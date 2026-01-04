import prisma from "@encre/db";
import { env } from "@encre/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { multiSession, openAPI, twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
	appName: "Encre",
	baseURL: env.BETTER_AUTH_URL || "http://localhost:3001",

	experimental: {
		joins: true,
	},

	database: prismaAdapter(prisma, {
		provider: "postgresql",
		transaction: true,
	}),

	trustedOrigins: [env.CORS_ORIGIN],

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		revokeSessionsOnPasswordReset: true,
	},

	emailVerification: {
		autoSignInAfterVerification: true,
		sendOnSignUp: true,
		async sendVerificationEmail({ user, url, token }) {
			// for development, we will just log the email
			// TODO: Send actual email
			console.log("=== === === === === === === === === === === ===");
			console.log(
				`Sending verification email to ${user.email} for user: ${user.name}`,
			);
			console.log(`URL: ${url}`);
			console.log(`Token: ${token}`);
			console.log("=== === === === === === === === === === === ===");
		},
	},

	user: {
		additionalFields: {
			username: {
				type: "string",
				required: true,
				input: true,
				unique: true,
				index: true,
				returned: true,
			},
			role: {
				type: "string",
				required: true,
				input: false,
				returned: true,
			},
		},
	},

	advanced: {
		cookiePrefix: "encre",
		useSecureCookies: env.NODE_ENV !== "development",

		crossSubDomainCookies: {
			enabled: env.NODE_ENV !== "development",
		},

		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},

		database: {
			generateId: "uuid",
		},
	},

	plugins: [
		nextCookies(),
		openAPI({
			enabled: env.NODE_ENV !== "production",
			path: "/reference",
			disableDefaultReference: true,
			theme: "saturn",
		}),
		twoFactor({
			issuer: "Encre",
		}),
		multiSession({
			maximumSessions: 3,
		}),
	],
});

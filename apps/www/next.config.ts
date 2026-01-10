import "@encre/env/www";
import { env } from "@encre/env/server";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
};

export default withSentryConfig(nextConfig, {
	org: env.SENTRY_ORG,
	project: env.SENTRY_PROJECT,
});

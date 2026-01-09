import type { auth } from "@encre/auth";
import {
	inferAdditionalFields,
	multiSessionClient,
	twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	plugins: [
		twoFactorClient(),
		multiSessionClient(),
		inferAdditionalFields<typeof auth>(),
	],
});

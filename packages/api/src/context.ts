import { auth } from "@encre/auth";
import type { UserRoleType } from "@encre/schemas/models/inputTypeSchemas/UserRoleSchema";
import type { NextRequest } from "next/server";

export async function createContext(req: NextRequest) {
	const session = await auth.api.getSession({
		headers: req.headers,
	});

	const role = session?.user?.role as UserRoleType | null;

	return {
		session: session?.session,
		user: { ...session?.user, role },
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;

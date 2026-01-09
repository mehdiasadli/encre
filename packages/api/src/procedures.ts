import prisma from "@encre/db";
import type { UserRoleType } from "@encre/schemas/models/inputTypeSchemas/UserRoleSchema";
import { ORPCError } from "@orpc/server";
import { o } from ".";

////
// HELPERS
////

const requireAuth = o.middleware(async ({ context, next }) => {
	if (!context.user || !context.session) {
		throw new ORPCError("UNAUTHORIZED");
	}

	const role = context.user.role as UserRoleType;

	return next({
		context: {
			session: context.session,
			user: context.user,
			role,
		},
	});
});

const requireAuthor = o.middleware(async ({ context, next }) => {
	if (!context.user || !context.session) {
		throw new ORPCError("UNAUTHORIZED");
	}

	const role = context.user.role as UserRoleType;

	const author = await prisma.author.findUnique({
		where: {
			userId: context.user.id,
		},
	});

	if (!author) {
		throw new ORPCError("NOT_FOUND", {
			message: "Author not found",
		});
	}

	return next({
		context: {
			session: context.session,
			user: context.user,
			author,
			role,
		},
	});
});

const requireRoles = (roles: UserRoleType[]) =>
	o.middleware(async ({ context, next }) => {
		if (!context.user || !context.session) {
			throw new ORPCError("UNAUTHORIZED");
		}

		if (
			!context.user.role ||
			!roles.includes(context.user.role as UserRoleType)
		) {
			throw new ORPCError("FORBIDDEN");
		}

		const role = context.user.role as UserRoleType;

		return next({
			context: {
				session: context.session,
				user: context.user,
				role,
			},
		});
	});

// PROCEDURES
////
/// PUBLIC PROCEDURE
export const publicProcedure = o;

/// PROTECTED PROCEDURE
export const protectedProcedure = publicProcedure.use(requireAuth);

/// AUTHOR PROCEDURE
export const authorProcedure = protectedProcedure.use(requireAuthor);

/// MODERATOR PROCEDURE
export const moderatorProcedure = protectedProcedure.use(
	requireRoles(["moderator"]),
);

/// ADMIN PROCEDURE
export const adminProcedure = protectedProcedure.use(requireRoles(["admin"]));

/// MODERATOR OR ADMIN PROCEDURE
export const moderatorOrAdminProcedure = protectedProcedure.use(
	requireRoles(["moderator", "admin"]),
);

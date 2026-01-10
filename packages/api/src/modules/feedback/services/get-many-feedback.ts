import prisma, { type Prisma } from "@encre/db";
import type {
	AdminGetManyFeedbackInput,
	AdminGetManyFeedbackOutput,
	GetManyFeedbackInput,
	GetManyFeedbackOutput,
} from "@encre/schemas/modules/feedback.schema";
import { ORPCError } from "@orpc/client";

export async function getManyFeedback(
	input: GetManyFeedbackInput,
	userId: string,
): Promise<GetManyFeedbackOutput> {
	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		throw new ORPCError("NOT_FOUND", {
			message: "User not found",
		});
	}

	const where: Prisma.FeedbackWhereInput = {
		userId,
		status: { not: "deleted" },
	};

	if (input.statuses && input.statuses.length > 0) {
		where.status = { in: input.statuses };
	}

	if (input.hasResponse !== undefined) {
		where.response = input.hasResponse ? { not: null } : null;
	}

	if (input.query) {
		where.OR = [
			{ subject: { contains: input.query, mode: input.mode } },
			{ content: { contains: input.query, mode: input.mode } },
		];
	}

	return await prisma.feedback.findMany({
		where,
		select: {
			content: true,
			createdAt: true,
			response: true,
			responseAt: true,
			status: true,
			subject: true,
			type: true,
		},
	});
}

export async function adminGetManyFeedback(
	input: AdminGetManyFeedbackInput,
): Promise<AdminGetManyFeedbackOutput> {
	const where: Prisma.FeedbackWhereInput = {};

	if (input.statuses && input.statuses.length > 0) {
		where.status = { in: input.statuses };
	}

	if (input.hasResponse) {
		where.response = { not: null };
	}

	if (input.types && input.types.length > 0) {
		where.type = { in: input.types };
	}

	if (input.priorities && input.priorities.length > 0) {
		where.priority = { in: input.priorities };
	}

	if (input.isAuthenticated) {
		where.userId = { not: null };

		if (input.users && input.users.length > 0) {
			where.user = { username: { in: input.users } };
		}
	}

	if (input.query) {
		where.OR = [
			{ subject: { contains: input.query, mode: input.mode } },
			{ content: { contains: input.query, mode: input.mode } },
		];
	}

	return await prisma.feedback.findMany({
		where,
		omit: {
			userId: true,
			image: true,
			responseById: true,
		},
		include: {
			user: {
				select: {
					email: true,
					name: true,
					username: true,
				},
			},
			responseBy: {
				select: {
					email: true,
					name: true,
					username: true,
				},
			},
		},
	});
}

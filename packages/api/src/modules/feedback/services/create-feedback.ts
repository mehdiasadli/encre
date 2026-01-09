import prisma from "@encre/db";
import type { CreateFeedbackInput } from "@encre/schemas/modules/feedback.schema";
import { ORPCError } from "@orpc/client";

export async function createFeedback(
	input: CreateFeedbackInput,
	userId?: string,
) {
	const user = userId
		? await prisma.user.findUnique({
				where: { id: userId },
			})
		: null;

	const email = user ? user.email : input.email;
	const name = user ? user.name : input.name;

	if (!email || !email.trim()) {
		throw new ORPCError("BAD_REQUEST", {
			message: "Email is required",
			data: { path: "email" },
		});
	}

	if (!name || !name.trim()) {
		throw new ORPCError("BAD_REQUEST", {
			message: "Name is required",
			data: { path: "name" },
		});
	}

	await prisma.feedback.create({
		data: {
			...input,
			name,
			email,
			userId,
		},
	});
}

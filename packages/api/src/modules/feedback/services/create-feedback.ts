import prisma from "@encre/db";
import type {
	CreateFeedbackInput,
	ResponseFeedbackInput,
} from "@encre/schemas/modules/feedback.schema";
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

export async function respondToFeedback(
	input: ResponseFeedbackInput,
	userId: string,
) {
	const { id, response, status } = input;

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
		},
	});

	if (!user) {
		throw new ORPCError("NOT_FOUND", {
			message: "User not found",
		});
	}

	const feedback = await prisma.feedback.findUnique({
		where: { id, status: { not: "deleted" } },
	});

	if (!feedback) {
		throw new ORPCError("NOT_FOUND", {
			message: "Feedback not found",
		});
	}

	if (feedback.response) {
		throw new ORPCError("BAD_REQUEST", {
			message: "Feedback already has a response",
			data: { path: "response" },
		});
	}

	await prisma.feedback.update({
		where: { id },
		data: {
			response,
			status,
			responseAt: new Date(),
			responseById: userId,
		},
	});
}

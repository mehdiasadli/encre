import prisma from "@encre/db";
import type { UpdateFeedbackInput } from "@encre/schemas/modules/feedback.schema";
import { ORPCError } from "@orpc/client";

export async function updateFeedback(input: UpdateFeedbackInput) {
	const { id, ...data } = input;
	const feedback = await prisma.feedback.findUnique({
		where: { id, status: { not: "deleted" } },
	});

	if (!feedback) {
		throw new ORPCError("NOT_FOUND", {
			message: "Feedback not found",
		});
	}

	await prisma.feedback.update({
		where: { id },
		data,
	});
}

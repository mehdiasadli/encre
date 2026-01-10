import prisma from "@encre/db";
import type { DeleteFeedbackInput } from "@encre/schemas/modules/feedback.schema";
import { ORPCError } from "@orpc/client";

export async function deleteFeedback(input: DeleteFeedbackInput) {
	const feedback = await prisma.feedback.findUnique({
		where: { id: input.id, status: { not: "deleted" } },
	});

	if (!feedback) {
		throw new ORPCError("NOT_FOUND", {
			message: "Feedback not found",
		});
	}

	await prisma.feedback.update({
		where: { id: input.id },
		data: {
			status: "deleted",
		},
	});
}

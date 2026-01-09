import { CreateFeedbackInputSchema } from "@encre/schemas/modules/feedback.schema";
import { publicProcedure } from "../../procedures";
import { createFeedback } from "./services/create-feedback";

export const feedbackRouter = {
	createFeedback: publicProcedure
		.input(CreateFeedbackInputSchema)
		.handler(
			async ({ input, context }) =>
				await createFeedback(input, context.user?.id),
		),
};

import {
	AdminGetManyFeedbackInputSchema,
	AdminGetManyFeedbackOutputSchema,
	CreateFeedbackInputSchema,
	DeleteFeedbackInputSchema,
	GetManyFeedbackInputSchema,
	GetManyFeedbackOutputSchema,
	ResponseFeedbackInputSchema,
	UpdateFeedbackInputSchema,
} from "@encre/schemas/modules/feedback.schema";
import {
	moderatorOrAdminProcedure,
	protectedProcedure,
	publicProcedure,
} from "../../procedures";
import { createFeedback, respondToFeedback } from "./services/create-feedback";
import { deleteFeedback } from "./services/delete-feedback";
import {
	adminGetManyFeedback,
	getManyFeedback,
} from "./services/get-many-feedback";
import { updateFeedback } from "./services/update-feedback";

export const feedbackRouter = {
	createFeedback: publicProcedure
		.input(CreateFeedbackInputSchema)
		.handler(
			async ({ input, context }) =>
				await createFeedback(input, context.user?.id),
		),
	respondToFeedback: moderatorOrAdminProcedure
		.input(ResponseFeedbackInputSchema)
		.handler(
			async ({ input, context }) =>
				await respondToFeedback(input, context.user.id),
		),
	getManyFeedback: protectedProcedure
		.input(GetManyFeedbackInputSchema)
		.output(GetManyFeedbackOutputSchema)
		.handler(
			async ({ input, context }) =>
				await getManyFeedback(input, context.user.id),
		),
	adminGetManyFeedback: moderatorOrAdminProcedure
		.input(AdminGetManyFeedbackInputSchema)
		.output(AdminGetManyFeedbackOutputSchema)
		.handler(async ({ input }) => await adminGetManyFeedback(input)),
	updateFeedback: moderatorOrAdminProcedure
		.input(UpdateFeedbackInputSchema)
		.handler(async ({ input }) => await updateFeedback(input)),
	deleteFeedback: moderatorOrAdminProcedure
		.input(DeleteFeedbackInputSchema)
		.handler(async ({ input }) => await deleteFeedback(input)),
};

import type { z } from "zod";
import { FeedbackSchema } from "../models";

export const CreateFeedbackInputSchema = FeedbackSchema.pick({
	subject: true,
	content: true,
	source: true,
	name: true,
	email: true,
	type: true,
}).partial({
	name: true,
	email: true,
});

export type CreateFeedbackInput = z.infer<typeof CreateFeedbackInputSchema>;

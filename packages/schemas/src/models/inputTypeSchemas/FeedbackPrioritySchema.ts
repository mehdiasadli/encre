import { z } from "zod";

export const FeedbackPrioritySchema = z.enum([
	"unset",
	"low",
	"medium",
	"high",
	"critical",
]);

export type FeedbackPriorityType = `${z.infer<typeof FeedbackPrioritySchema>}`;

export default FeedbackPrioritySchema;

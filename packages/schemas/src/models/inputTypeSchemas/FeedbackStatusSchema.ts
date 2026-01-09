import { z } from "zod";

export const FeedbackStatusSchema = z.enum([
	"pending",
	"reviewed",
	"rejected",
	"resolved",
	"deleted",
]);

export type FeedbackStatusType = `${z.infer<typeof FeedbackStatusSchema>}`;

export default FeedbackStatusSchema;

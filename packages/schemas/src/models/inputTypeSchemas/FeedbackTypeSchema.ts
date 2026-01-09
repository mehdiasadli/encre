import { z } from "zod";

export const FeedbackTypeSchema = z.enum([
	"bug",
	"security",
	"feature_request",
	"complaint",
	"other",
]);

export type FeedbackTypeType = `${z.infer<typeof FeedbackTypeSchema>}`;

export default FeedbackTypeSchema;

import { z } from "zod";
import { FeedbackPrioritySchema } from "../inputTypeSchemas/FeedbackPrioritySchema";
import { FeedbackSourceSchema } from "../inputTypeSchemas/FeedbackSourceSchema";
import { FeedbackStatusSchema } from "../inputTypeSchemas/FeedbackStatusSchema";
import { FeedbackTypeSchema } from "../inputTypeSchemas/FeedbackTypeSchema";

/////////////////////////////////////////
// FEEDBACK SCHEMA
/////////////////////////////////////////

export const FeedbackSchema = z.object({
	status: FeedbackStatusSchema,
	source: FeedbackSourceSchema,
	priority: FeedbackPrioritySchema,
	type: FeedbackTypeSchema,
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	userId: z.uuid({ message: "Invalid user ID" }).nullish(),
	ipAddress: z.string().nullish(),
	userAgent: z.string().nullish(),
	name: z
		.string()
		.min(1, { message: "Name is required" })
		.max(50, { message: "Name cannot exceed 50 characters" }),
	email: z.email({ message: "Invalid email address" }),
	subject: z
		.string()
		.min(1, { message: "Subject is required" })
		.max(100, { message: "Subject cannot exceed 100 characters" }),
	content: z
		.string()
		.min(1, { message: "Content is required" })
		.max(1000, { message: "Content cannot exceed 1000 characters" }),
	image: z.url({ message: "Invalid image URL" }).nullish(),
	response: z
		.string()
		.max(1000, { message: "Response cannot exceed 1000 characters" })
		.nullish(),
	responseAt: z.coerce.date().nullish(),
	responseById: z.uuid({ message: "Invalid response by ID" }).nullish(),
});

export type Feedback = z.infer<typeof FeedbackSchema>;

export default FeedbackSchema;

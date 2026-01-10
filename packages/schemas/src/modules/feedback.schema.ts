import { z } from "zod";
import { SearchSchema } from "../common.schema";
import {
	FeedbackPrioritySchema,
	FeedbackSchema,
	FeedbackStatusSchema,
	FeedbackTypeSchema,
	UserSchema,
} from "../models";

////
// CREATE
////

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

export const ResponseFeedbackInputSchema = FeedbackSchema.pick({
	id: true,
	response: true,
}).extend({
	status: FeedbackStatusSchema.exclude(["deleted", "pending"]).optional(),
});

export type ResponseFeedbackInput = z.infer<typeof ResponseFeedbackInputSchema>;

////
// DELETE
////
export const DeleteFeedbackInputSchema = FeedbackSchema.pick({
	id: true,
});

export type DeleteFeedbackInput = z.infer<typeof DeleteFeedbackInputSchema>;

////
// UPDATE (admin)
////
export const UpdateFeedbackInputSchema = FeedbackSchema.pick({
	id: true,
	source: true,
	priority: true,
	type: true,
})
	.extend({
		status: FeedbackStatusSchema.exclude(["deleted"]),
	})
	.partial()
	.required({ id: true });

export type UpdateFeedbackInput = z.infer<typeof UpdateFeedbackInputSchema>;

////
// GET MANY (user)
////
export const GetManyFeedbackInputSchema = z
	.object({
		statuses: FeedbackStatusSchema.exclude(["deleted"]).array(),
		hasResponse: z.boolean(),
	})
	.partial()
	.extend(SearchSchema.shape);

export type GetManyFeedbackInput = z.infer<typeof GetManyFeedbackInputSchema>;

export const GetManyFeedbackOutputSchema = FeedbackSchema.pick({
	content: true,
	createdAt: true,
	response: true,
	responseAt: true,
	status: true,
	subject: true,
	type: true,
}).array();

export type GetManyFeedbackOutput = z.infer<typeof GetManyFeedbackOutputSchema>;

export const AdminGetManyFeedbackInputSchema = z
	.object({
		statuses: FeedbackStatusSchema.array(),
		types: FeedbackTypeSchema.array(),
		priorities: FeedbackPrioritySchema.array(),
		users: z.string().array(), // usernames
		hasResponse: z.boolean(),
		isAuthenticated: z.boolean(),
	})
	.partial()
	.extend(SearchSchema.shape);

export type AdminGetManyFeedbackInput = z.infer<
	typeof AdminGetManyFeedbackInputSchema
>;

export const AdminGetManyFeedbackOutputSchema = FeedbackSchema.omit({
	userId: true,
	image: true,
	responseById: true,
})
	.extend({
		user: UserSchema.pick({
			email: true,
			name: true,
			username: true,
		}).nullable(),
		responseBy: UserSchema.pick({
			email: true,
			name: true,
			username: true,
		}).nullable(),
	})
	.array();

export type AdminGetManyFeedbackOutput = z.infer<
	typeof AdminGetManyFeedbackOutputSchema
>;

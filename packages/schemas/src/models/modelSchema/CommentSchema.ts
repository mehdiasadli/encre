import { z } from "zod";
import { slugRegex } from "../../regex";
import { CommentTypeSchema } from "../inputTypeSchemas/CommentTypeSchema";

/////////////////////////////////////////
// COMMENT SCHEMA
/////////////////////////////////////////

export const CommentSchema = z.object({
	type: CommentTypeSchema,
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	slug: z.string().regex(slugRegex, { message: "Invalid slug" }),
	content: z
		.string()
		.min(1, { message: "Content is required" })
		.max(1000, { message: "Content cannot exceed 1000 characters" }),
	userId: z.uuid({ message: "Invalid user ID" }),
	depth: z
		.number()
		.int({ message: "Invalid depth" })
		.min(0, { message: "Depth must be at least 0" })
		.max(5, { message: "Comment depth cannot exceed the maximum depth" }),
	parentCommentId: z.uuid({ message: "Invalid parent comment ID" }).nullish(),
	postId: z.uuid({ message: "Invalid post ID" }).nullish(),
	serieId: z.uuid({ message: "Invalid serie ID" }).nullish(),
	bookId: z.uuid({ message: "Invalid book ID" }).nullish(),
	chapterId: z.uuid({ message: "Invalid chapter ID" }).nullish(),
	characterId: z.uuid({ message: "Invalid character ID" }).nullish(),
	placeId: z.uuid({ message: "Invalid place ID" }).nullish(),
	authorId: z.uuid({ message: "Invalid author ID" }).nullish(),
	articleId: z.uuid({ message: "Invalid article ID" }).nullish(),
});

export type Comment = z.infer<typeof CommentSchema>;

/////////////////////////////////////////
// COMMENT CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const CommentCustomValidatorsSchema = CommentSchema;

export type CommentCustomValidators = z.infer<
	typeof CommentCustomValidatorsSchema
>;

export default CommentSchema;

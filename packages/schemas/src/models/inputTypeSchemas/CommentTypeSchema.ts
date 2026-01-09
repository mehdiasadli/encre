import { z } from "zod";

export const CommentTypeSchema = z.enum([
	"post",
	"comment",
	"serie",
	"book",
	"chapter",
	"character",
	"place",
	"author",
	"article",
]);

export type CommentTypeType = `${z.infer<typeof CommentTypeSchema>}`;

export default CommentTypeSchema;

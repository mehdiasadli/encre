import { z } from "zod";

export const PostAttachementTypeSchema = z.enum([
	"post",
	"author",
	"comment",
	"serie",
	"book",
	"chapter",
	"character",
	"place",
]);

export type PostAttachementTypeType =
	`${z.infer<typeof PostAttachementTypeSchema>}`;

export default PostAttachementTypeSchema;

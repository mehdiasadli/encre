import { z } from "zod";
import { slugRegex } from "../../regex";

/////////////////////////////////////////
// POST SCHEMA
/////////////////////////////////////////

export const PostSchema = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	slug: z.string().regex(slugRegex, { message: "Invalid slug" }),
	content: z
		.string()
		.max(1000, { message: "Content cannot exceed 1000 characters" })
		.nullish(),
	image: z.url({ message: "Invalid image URL" }).nullish(),
});

export type Post = z.infer<typeof PostSchema>;

/////////////////////////////////////////
// POST CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const PostCustomValidatorsSchema = PostSchema;

export type PostCustomValidators = z.infer<typeof PostCustomValidatorsSchema>;

export default PostSchema;

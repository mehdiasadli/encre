import { z } from "zod";
import { slugRegex } from "../../regex";
import { ArticleTypeSchema } from "../inputTypeSchemas/ArticleTypeSchema";

/////////////////////////////////////////
// ARTICLE SCHEMA
/////////////////////////////////////////

export const ArticleSchema = z.object({
	type: ArticleTypeSchema,
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	slug: z.string().regex(slugRegex, { message: "Invalid slug" }),
	title: z
		.string()
		.min(2, { message: "Title must be at least 2 characters" })
		.max(50, { message: "Title cannot exceed 50 characters" }),
	description: z
		.string()
		.max(1000, { message: "Description cannot exceed 1000 characters" })
		.nullish(),
	image: z.url({ message: "Invalid image URL" }).nullish(),
	content: z.string().nullish(),
	bookId: z.uuid({ message: "Invalid book ID" }).nullish(),
	chapterId: z.uuid({ message: "Invalid chapter ID" }).nullish(),
	characterId: z.uuid({ message: "Invalid character ID" }).nullish(),
	placeId: z.uuid({ message: "Invalid place ID" }).nullish(),
});

export type Article = z.infer<typeof ArticleSchema>;

/////////////////////////////////////////
// ARTICLE CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const ArticleCustomValidatorsSchema = ArticleSchema;

export type ArticleCustomValidators = z.infer<
	typeof ArticleCustomValidatorsSchema
>;

export default ArticleSchema;

import { z } from "zod";
import { slugRegex } from "../../regex";
import { DeletionResourceSchema } from "../inputTypeSchemas/DeletionResourceSchema";
import { ResourceStatusSchema } from "../inputTypeSchemas/ResourceStatusSchema";

/////////////////////////////////////////
// CHAPTER SCHEMA
/////////////////////////////////////////

export const ChapterSchema = z.object({
	deletionReason: DeletionResourceSchema.nullish(),
	status: ResourceStatusSchema,
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	editedAt: z.coerce.date().nullish(),
	slug: z.string().regex(slugRegex, { message: "Invalid slug" }),
	deletedAt: z.coerce.date().nullish(),
	title: z
		.string()
		.min(2, { message: "Title must be at least 2 characters" })
		.max(50, { message: "Title cannot exceed 50 characters" }),
	description: z
		.string()
		.max(1000, { message: "Description cannot exceed 1000 characters" })
		.nullish(),
	image: z.url({ message: "Invalid image URL" }).nullish(),
	content: z.string(),
	serieId: z.uuid({ message: "Invalid serie ID" }),
	bookId: z.uuid({ message: "Invalid book ID" }),
	authorId: z.uuid({ message: "Invalid author ID" }),
	order: z
		.number()
		.int({ message: "Invalid order" })
		.min(1, { message: "Order must be at least 1" }),
	views: z.number().int(),
});

export type Chapter = z.infer<typeof ChapterSchema>;

/////////////////////////////////////////
// CHAPTER CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const ChapterCustomValidatorsSchema = ChapterSchema;

export type ChapterCustomValidators = z.infer<
	typeof ChapterCustomValidatorsSchema
>;

export default ChapterSchema;

import { z } from "zod";
import { slugRegex } from "../../regex";
import { DeletionResourceSchema } from "../inputTypeSchemas/DeletionResourceSchema";
import { ResourceStatusSchema } from "../inputTypeSchemas/ResourceStatusSchema";

/////////////////////////////////////////
// BOOK SCHEMA
/////////////////////////////////////////

export const BookSchema = z.object({
	deletionReason: DeletionResourceSchema.nullish(),
	status: ResourceStatusSchema,
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
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
	serieId: z.uuid({ message: "Invalid serie ID" }),
	authorId: z.uuid({ message: "Invalid author ID" }),
	order: z
		.number()
		.int({ message: "Invalid order" })
		.min(1, { message: "Order must be at least 1" }),
});

export type Book = z.infer<typeof BookSchema>;

/////////////////////////////////////////
// BOOK CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const BookCustomValidatorsSchema = BookSchema;

export type BookCustomValidators = z.infer<typeof BookCustomValidatorsSchema>;

export default BookSchema;

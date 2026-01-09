import { z } from "zod";
import { slugRegex } from "../../regex";

/////////////////////////////////////////
// READ SCHEMA
/////////////////////////////////////////

export const ReadSchema = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	slug: z.string().regex(slugRegex, { message: "Invalid slug" }),
	userId: z.uuid({ message: "Invalid user ID" }),
	bookId: z.uuid({ message: "Invalid book ID" }).nullish(),
	chapterId: z.uuid({ message: "Invalid chapter ID" }).nullish(),
	rating: z
		.number()
		.int({ message: "Invalid rating" })
		.min(1, { message: "Rating must be at least 1" })
		.max(5, { message: "Rating cannot exceed 5" })
		.nullish(),
	review: z
		.string()
		.max(1000, { message: "Review cannot exceed 1000 characters" })
		.nullish(),
});

export type Read = z.infer<typeof ReadSchema>;

/////////////////////////////////////////
// READ CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const ReadCustomValidatorsSchema = ReadSchema;

export type ReadCustomValidators = z.infer<typeof ReadCustomValidatorsSchema>;

export default ReadSchema;

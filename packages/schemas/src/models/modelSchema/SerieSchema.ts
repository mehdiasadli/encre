import { z } from "zod";
import { slugRegex } from "../../regex";
import { DeletionResourceSchema } from "../inputTypeSchemas/DeletionResourceSchema";
import { ResourceStatusSchema } from "../inputTypeSchemas/ResourceStatusSchema";
import { ResourceVisibilitySchema } from "../inputTypeSchemas/ResourceVisibilitySchema";

/////////////////////////////////////////
// SERIE SCHEMA
/////////////////////////////////////////

export const SerieSchema = z.object({
	deletionReason: DeletionResourceSchema,
	status: ResourceStatusSchema,
	visibility: ResourceVisibilitySchema,
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
	authorId: z.uuid({ message: "Invalid author ID" }),
});

export type Serie = z.infer<typeof SerieSchema>;

/////////////////////////////////////////
// SERIE CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const SerieCustomValidatorsSchema = SerieSchema;

export type SerieCustomValidators = z.infer<typeof SerieCustomValidatorsSchema>;

export default SerieSchema;

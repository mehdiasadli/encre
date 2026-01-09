import { z } from "zod";
import { ShelfVisibilitySchema } from "../inputTypeSchemas/ShelfVisibilitySchema";

/////////////////////////////////////////
// SHELF SCHEMA
/////////////////////////////////////////

export const ShelfSchema = z.object({
	visibility: ShelfVisibilitySchema,
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	slug: z.string().min(1, { message: "Slug is required" }),
	name: z.string().min(1, { message: "Name is required" }),
	description: z
		.string()
		.max(1000, { message: "Description cannot exceed 1000 characters" })
		.nullish(),
	image: z.url({ message: "Invalid image URL" }).nullish(),
	userId: z.uuid({ message: "Invalid user ID" }),
	isOrdered: z.boolean(),
});

export type Shelf = z.infer<typeof ShelfSchema>;

export default ShelfSchema;

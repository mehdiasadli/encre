import { z } from "zod";
import { slugRegex } from "../../regex";

/////////////////////////////////////////
// AUTHOR SCHEMA
/////////////////////////////////////////

export const AuthorSchema = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	userId: z.uuid({ message: "Invalid user ID" }),
	name: z
		.string()
		.min(1, { message: "Name is required" })
		.max(50, { message: "Name cannot exceed 50 characters" }),
	slug: z.string().regex(slugRegex, { message: "Invalid slug" }),
	bio: z
		.string()
		.max(1000, { message: "Bio cannot exceed 1000 characters" })
		.nullish(),
	image: z.url({ message: "Invalid image URL" }).nullish(),
	website: z.url({ message: "Invalid website URL" }).nullish(),
});

export type Author = z.infer<typeof AuthorSchema>;

/////////////////////////////////////////
// AUTHOR CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const AuthorCustomValidatorsSchema = AuthorSchema;

export type AuthorCustomValidators = z.infer<
	typeof AuthorCustomValidatorsSchema
>;

export default AuthorSchema;

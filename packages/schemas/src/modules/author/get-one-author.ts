import type { z } from "zod";
import { AuthorSchema } from "../../models";

export const GetOneAuthorInputSchema = AuthorSchema.pick({});
export type GetOneAuthorInputType = z.infer<typeof GetOneAuthorInputSchema>;

export const GetOneAuthorOutputSchema = AuthorSchema.pick({});
export type GetOneAuthorOutputType = z.infer<typeof GetOneAuthorOutputSchema>;

export const GetMyAuthorOutputSchema = AuthorSchema.pick({
	name: true,
	slug: true,
	bio: true,
	image: true,
	website: true,
}).nullable();
export type GetMyAuthorOutputType = z.infer<typeof GetMyAuthorOutputSchema>;

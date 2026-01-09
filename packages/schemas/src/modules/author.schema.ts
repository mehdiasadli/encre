import type z from "zod";
import { AuthorSchema } from "../models";

export const GetMyAuthorOutputSchema = AuthorSchema.pick({
	name: true,
	slug: true,
	bio: true,
	image: true,
	website: true,
}).nullable();

export type GetMyAuthorOutput = z.infer<typeof GetMyAuthorOutputSchema>;

export const BecomeAuthorInputSchema = AuthorSchema.pick({
	name: true,
	website: true,
	bio: true,
	slug: true,
}).partial();

export type BecomeAuthorInput = z.infer<typeof BecomeAuthorInputSchema>;

export const BecomeAuthorOutputSchema = AuthorSchema.pick({
	slug: true,
});

export type BecomeAuthorOutput = z.infer<typeof BecomeAuthorOutputSchema>;

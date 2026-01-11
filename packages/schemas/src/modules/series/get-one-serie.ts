import type { z } from "zod";
import { CountSchema } from "../../common.schema";
import { SerieSchema } from "../../models";

/**
 * AUTHOR
 */

export const AuthorGetOneSerieInputSchema = SerieSchema.pick({
	slug: true,
});
export type AuthorGetOneSerieInputType = z.infer<
	typeof AuthorGetOneSerieInputSchema
>;

export const AuthorGetOneSerieOutputSchema = SerieSchema.omit({
	id: true,
	authorId: true,
	deletedAt: true,
	deletionReason: true,
}).extend({
	_count: CountSchema(["books", "likes"]),
});

export type AuthorGetOneSerieOutputType = z.infer<
	typeof AuthorGetOneSerieOutputSchema
>;

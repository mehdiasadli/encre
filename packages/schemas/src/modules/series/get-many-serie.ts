import { z } from "zod";
import { SerieSchema } from "../../models";

/**
 * PUBLIC
 */

/**
 * AUTHOR
 */
export const AuthorGetManySerieOutputSchema = z.array(
	SerieSchema.pick({
		title: true,
		slug: true,
		visibility: true,
		status: true,
	}),
);
export type AuthorGetManySerieOutputType = z.infer<
	typeof AuthorGetManySerieOutputSchema
>;

/**
 * ADMIN
 */

import z from "zod";

export const SearchableResourceSchema = z.enum([
	"serie",
	"book",
	"chapter",
	"character",
	"place",
	"article",
]);
export type SearchableResourceType =
	`${z.infer<typeof SearchableResourceSchema>}`;

export const AuthorSearchResourceInputSchema = z
	.object({
		query: z
			.string()
			.max(100, { message: "Query must be less than 100 characters" }),
		type: SearchableResourceSchema,
	})
	.partial();

export type AuthorSearchResourceInputType = z.infer<
	typeof AuthorSearchResourceInputSchema
>;

export const AuthorSearchResourceOutputSchema = z.object({
	type: SearchableResourceSchema,
	items: z.array(
		z.object({
			title: z.string(),
			slug: z.string(),
			description: z.string().nullable(),
		}),
	),
});

export type AuthorSearchResourceOutputType = z.infer<
	typeof AuthorSearchResourceOutputSchema
>;

import z from "zod";
import { SortOrderSchema } from "./models";
import { slugRegex } from "./regex";

////
// SLUG
////
export const SlugSchema = z
	.string()
	.min(1, { message: "Slug is required" })
	.max(255, { message: "Slug must be less than 255 characters" })
	.regex(slugRegex, {
		message: "Slug must contain only lowercase letters, numbers and hyphens",
	});

export type SlugType = z.infer<typeof SlugSchema>;

////
// PAGINATION
////
export const PaginationInputSchema = z.object({
	page: z.number().int().positive().default(1),
	take: z.number().int().positive().max(100).default(20),
});

export type PaginationInputType = z.infer<typeof PaginationInputSchema>;

export const PaginationOutputSchema = <T extends z.ZodType>(schema: T) =>
	z.object({
		items: z.array(schema),
		totalItems: z.number().int().min(0),
		totalPages: z.number().int().min(0),
		page: z.number().int().positive(),
		take: z.number().int().positive(),
		hasNextPage: z.boolean(),
	});

export type PaginationOutputType<T extends z.ZodType> = z.infer<
	ReturnType<typeof PaginationOutputSchema<T>>
>;

////
// SORTING
////

export const SortingSchema = <const T extends readonly string[]>(
	fields: T,
	defaultField?: T[number],
) => {
	return z.object({
		dir: SortOrderSchema.default("asc"),
		// biome-ignore lint/style/noNonNullAssertion: no default field
		field: z.enum(fields).default(defaultField ?? fields[0]!),
	});
};

////
// SEARCHING
////

export const SearchSchema = z.object({
	query: z.string().optional(),
	mode: z.enum(["default", "insensitive"]).default("insensitive"),
});

export type SearchType = z.infer<typeof SearchSchema>;

////
// RANGE FILTERING
////

export const RangeFilterSchema = z.object({
	gte: z.coerce.date().optional(),
	lte: z.coerce.date().optional(),
});

export type RangeFilterType = z.infer<typeof RangeFilterSchema>;

/**
 * Usage:
 *
 * ...
 * _count: CountSchema("reads", "likes", ...)
 * ...
 */
export const CountSchema = <const T extends readonly string[]>(fields: T) =>
	z.object(
		fields.reduce(
			// biome-ignore lint/performance/noAccumulatingSpread: reduce to object
			(acc, field) => ({ ...acc, [field]: z.number().int().min(0) }),
			{} as Record<T[number], z.ZodNumber>,
		) as Record<T[number], z.ZodNumber>,
	);

export type CountType<T extends readonly string[]> = z.infer<
	ReturnType<typeof CountSchema<T>>
>;

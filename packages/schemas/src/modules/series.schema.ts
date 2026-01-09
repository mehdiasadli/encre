import z from "zod";
import {
	PaginationInputSchema,
	PaginationOutputSchema,
	RangeFilterSchema,
	SearchSchema,
	SortingSchema,
} from "../common.schema";
import {
	AuthorSchema,
	ResourceStatusSchema,
	ResourceVisibilitySchema,
	SerieScalarFieldEnumSchema,
	SerieSchema,
} from "../models";

export const UniqueSerieSchema = SerieSchema.pick({
	slug: true,
});
export type UniqueSerieType = z.infer<typeof UniqueSerieSchema>;

export const GetSeriesListInputSchema = z
	.object({
		authors: z.string().array(),
		statuses: ResourceStatusSchema.array(),
		visibilities: ResourceVisibilitySchema.array(),
	})
	.partial()
	.extend(PaginationInputSchema.shape)
	.extend(
		SortingSchema(
			SerieScalarFieldEnumSchema.extract(["createdAt", "title"]).options,
			"createdAt",
		).shape,
	)
	.extend(SearchSchema.shape)
	.extend(RangeFilterSchema.shape);

export type GetSeriesListInputType = z.infer<typeof GetSeriesListInputSchema>;

export const GetSeriesListOutputSchema = PaginationOutputSchema(
	SerieSchema.pick({
		title: true,
		slug: true,
		status: true,
		visibility: true,
	}),
);
export type GetSeriesListOutputType = z.infer<typeof GetSeriesListOutputSchema>;

export const AuthorGetSeriesListOutputSchema = z.array(
	SerieSchema.pick({
		title: true,
		slug: true,
		status: true,
		visibility: true,
	}),
);
export type AuthorGetSeriesListOutputType = z.infer<
	typeof AuthorGetSeriesListOutputSchema
>;

export const CreateSerieInputSchema = SerieSchema.pick({
	title: true,
	description: true,
});
export type CreateSerieInputType = z.infer<typeof CreateSerieInputSchema>;

export const CreateSerieOutputSchema = UniqueSerieSchema;
export type CreateSerieOutputType = z.infer<typeof CreateSerieOutputSchema>;

export const UpdateSerieInputSchema = SerieSchema.pick({
	title: true,
	description: true,
	status: true,
	visibility: true,
	slug: true,
})
	.partial()
	.required({ slug: true });
export type UpdateSerieInputType = z.infer<typeof UpdateSerieInputSchema>;

export const UpdateSerieOutputSchema = UniqueSerieSchema;
export type UpdateSerieOutputType = z.infer<typeof UpdateSerieOutputSchema>;

export const DeleteSerieInputSchema = SerieSchema.pick({
	slug: true,
	title: true,
});
export type DeleteSerieInputType = z.infer<typeof DeleteSerieInputSchema>;

export const DeleteSerieOutputSchema = UniqueSerieSchema;
export type DeleteSerieOutputType = z.infer<typeof DeleteSerieOutputSchema>;

export const GetSerieInputSchema = UniqueSerieSchema.extend({
	bookStatuses: ResourceStatusSchema.array().optional(),
	bookCount: z.number().int().positive().optional(),
});
export type GetSerieInputType = z.infer<typeof GetSerieInputSchema>;

export const GetSerieOutputSchema = SerieSchema.omit({
	id: true,
	authorId: true,
	deletedAt: true,
	deletionReason: true,
}).extend({
	author: AuthorSchema.pick({
		name: true,
		slug: true,
		image: true,
	}),
	_count: z.object({
		books: z.number(),
		likes: z.number(),
	}),
});
export type GetSerieOutputType = z.infer<typeof GetSerieOutputSchema>;

import z from "zod";
import {
	CountSchema,
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

export const GetSeriesListOutputSchema = SerieSchema.pick({
	title: true,
	slug: true,
	visibility: true,
})
	.extend({
		author: AuthorSchema.pick({
			name: true,
			slug: true,
			image: true,
		}),
	})
	.array();

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

export const GetSerieInputSchema = UniqueSerieSchema;
export type GetSerieInputType = z.infer<typeof GetSerieInputSchema>;

export const AuthorGetSerieOutputSchema = SerieSchema.omit({
	id: true,
	authorId: true,
	deletedAt: true,
	deletionReason: true,
}).extend({
	_count: CountSchema(["books", "likes"]),
});

export type AuthorGetSerieOutputType = z.infer<
	typeof AuthorGetSerieOutputSchema
>;

export const GetSerieOutputSchema = SerieSchema.omit({
	id: true,
	authorId: true,
	deletedAt: true,
	deletionReason: true,
	status: true,
}).extend({
	_count: CountSchema(["books", "likes"]),
	author: AuthorSchema.pick({
		name: true,
		slug: true,
		image: true,
	}),
});
export type GetSerieOutputType = z.infer<typeof GetSerieOutputSchema>;

export const AdminGetSerieOutputSchema = SerieSchema.extend({
	_count: CountSchema(["books", "likes"]),
	author: AuthorSchema.pick({
		name: true,
		slug: true,
		image: true,
	}),
});
export type AdminGetSerieOutputType = z.infer<typeof AdminGetSerieOutputSchema>;

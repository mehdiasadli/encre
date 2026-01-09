import { z } from "zod";
import {
	CountSchema,
	PaginationInputSchema,
	PaginationOutputSchema,
	RangeFilterSchema,
	SearchSchema,
	SlugSchema,
	SortingSchema,
} from "../common.schema";
import {
	AuthorSchema,
	BookScalarFieldEnumSchema,
	BookSchema,
	ChapterSchema,
	ResourceStatusSchema,
	SerieSchema,
} from "../models";

export const UniqueBookSchema = BookSchema.pick({
	slug: true,
});
export type UniqueBookType = z.infer<typeof UniqueBookSchema>;

export const AuthorGetBooksListInputSchema = z
	.object({
		series: SlugSchema.array(),
		statuses: ResourceStatusSchema.exclude(["deleted"]).array(),
	})
	.partial()
	.extend(SearchSchema.shape)
	.extend(
		SortingSchema(
			BookScalarFieldEnumSchema.extract(["createdAt", "title", "order"])
				.options,
			"order",
		).shape,
	);

export type AuthorGetBooksListInputType = z.infer<
	typeof AuthorGetBooksListInputSchema
>;

export const AuthorGetBooksListOutputSchema = z.array(
	BookSchema.pick({
		title: true,
		slug: true,
		status: true,
		description: true,
		createdAt: true,
		updatedAt: true,
		order: true,
	}).extend({
		_count: CountSchema(["chapters", "likes", "reads", "shelves"]),
	}),
);
export type AuthorGetBooksListOutputType = z.infer<
	typeof AuthorGetBooksListOutputSchema
>;

export const GetBooksListInputSchema = z
	.object({
		authors: z.string().array(),
		series: z.string().array(),
		statuses: ResourceStatusSchema.array(),
	})
	.partial()
	.extend(PaginationInputSchema.shape)
	.extend(SearchSchema.shape)
	.extend(RangeFilterSchema.shape)
	.extend(
		SortingSchema(
			BookScalarFieldEnumSchema.extract(["createdAt", "title", "order"])
				.options,
			"order",
		).shape,
	);

export type GetBooksListInputType = z.infer<typeof GetBooksListInputSchema>;

export const GetBooksListOutputSchema = PaginationOutputSchema(
	BookSchema.pick({
		title: true,
		slug: true,
		status: true,
		description: true,
		createdAt: true,
		updatedAt: true,
		order: true,
	}).extend({
		author: AuthorSchema.pick({
			name: true,
			slug: true,
			image: true,
		}),
		serie: SerieSchema.pick({
			title: true,
			slug: true,
			status: true,
			visibility: true,
		}),
	}),
);
export type GetBooksListOutputType = z.infer<typeof GetBooksListOutputSchema>;

export const CreateBookInputSchema = BookSchema.pick({
	title: true,
	description: true,
}).extend({
	serie: SerieSchema.shape.slug,
});
export type CreateBookInputType = z.infer<typeof CreateBookInputSchema>;

export const CreateBookOutputSchema = UniqueBookSchema;
export type CreateBookOutputType = z.infer<typeof CreateBookOutputSchema>;

export const UpdateBookInputSchema = BookSchema.pick({
	title: true,
	description: true,
	status: true,
	slug: true,
})
	.partial()
	.required({ slug: true });
export type UpdateBookInputType = z.infer<typeof UpdateBookInputSchema>;

export const UpdateBookOutputSchema = UniqueBookSchema;
export type UpdateBookOutputType = z.infer<typeof UpdateBookOutputSchema>;

export const SwapBookOrderInputSchema = z.object({
	book1: BookSchema.shape.slug,
	book2: BookSchema.shape.slug,
});
export type SwapBookOrderInputType = z.infer<typeof SwapBookOrderInputSchema>;

export const SwapBookOrderOutputSchema = z.object({
	book1: BookSchema.shape.slug,
	book2: BookSchema.shape.slug,
});
export type SwapBookOrderOutputType = z.infer<typeof SwapBookOrderOutputSchema>;

export const DeleteBookInputSchema = BookSchema.pick({
	slug: true,
	title: true,
});
export type DeleteBookInputType = z.infer<typeof DeleteBookInputSchema>;

export const DeleteBookOutputSchema = UniqueBookSchema;
export type DeleteBookOutputType = z.infer<typeof DeleteBookOutputSchema>;

export const GetBookInputSchema = UniqueBookSchema.extend({
	chapters: z
		.object({
			count: z.number().int().positive(),
			statuses: ResourceStatusSchema.array(),
		})
		.partial()
		.optional(),
});
export type GetBookInputType = z.infer<typeof GetBookInputSchema>;

export const AuthorGetBookInputSchema = UniqueBookSchema;
export type AuthorGetBookInputType = z.infer<typeof AuthorGetBookInputSchema>;

export const AuthorGetBookOutputSchema = BookSchema.omit({
	id: true,
	authorId: true,
	serieId: true,
	deletedAt: true,
	deletionReason: true,
}).extend({
	status: ResourceStatusSchema.exclude(["deleted"]),
	_count: CountSchema(["chapters", "likes", "reads", "shelves"]),
});
export type AuthorGetBookOutputType = z.infer<typeof AuthorGetBookOutputSchema>;

export const GetBookOutputSchema = BookSchema.omit({
	id: true,
	authorId: true,
}).extend({
	_count: CountSchema(["chapters", "likes", "reads", "shelves"]),
	author: AuthorSchema.pick({
		name: true,
		slug: true,
		image: true,
	}),
	chapters: z.array(
		ChapterSchema.pick({
			title: true,
			slug: true,
			order: true,
			status: true,
			views: true,
		}).extend({
			_count: CountSchema(["reads", "likes"]),
		}),
	),
});

export type GetBookOutputType = z.infer<typeof GetBookOutputSchema>;

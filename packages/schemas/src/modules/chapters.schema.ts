import { z } from "zod";
import {
	CountSchema,
	SearchSchema,
	SlugSchema,
	SortingSchema,
} from "../common.schema";
import {
	BookSchema,
	ChapterScalarFieldEnumSchema,
	ChapterSchema,
	ResourceStatusSchema,
} from "../models";

export const UniqueChapterSchema = ChapterSchema.pick({
	slug: true,
});
export type UniqueChapterType = z.infer<typeof UniqueChapterSchema>;

export const CreateChapterInputSchema = ChapterSchema.pick({
	title: true,
	description: true,
}).extend({
	book: BookSchema.shape.slug,
});

export type CreateChapterInputType = z.infer<typeof CreateChapterInputSchema>;

export const CreateChapterOutputSchema = UniqueChapterSchema;
export type CreateChapterOutputType = z.infer<typeof CreateChapterOutputSchema>;

export const AuthorGetChapterInputSchema = UniqueChapterSchema;
export type AuthorGetChapterInputType = z.infer<
	typeof AuthorGetChapterInputSchema
>;

export const AuthorGetChapterOutputSchema = ChapterSchema.omit({
	id: true,
	authorId: true,
	bookId: true,
	serieId: true,
	deletedAt: true,
	deletionReason: true,
	content: true,
	draft: true,
}).extend({
	status: ResourceStatusSchema.exclude(["deleted"]),
	_count: CountSchema(["reads", "likes"]),
});
export type AuthorGetChapterOutputType = z.infer<
	typeof AuthorGetChapterOutputSchema
>;

export const AuthorGetChaptersListInputSchema = z
	.object({
		statuses: ResourceStatusSchema.exclude(["deleted"]).array(),
		books: SlugSchema.array(),
	})
	.partial()
	.extend(SearchSchema.shape)
	.extend(
		SortingSchema(
			ChapterScalarFieldEnumSchema.extract(["createdAt", "title", "order"])
				.options,
			"order",
		).shape,
	);

export type AuthorGetChaptersListInputType = z.infer<
	typeof AuthorGetChaptersListInputSchema
>;

export const AuthorGetChaptersListOutputSchema = z.array(
	ChapterSchema.pick({
		title: true,
		slug: true,
		status: true,
		description: true,
		createdAt: true,
		updatedAt: true,
		order: true,
		views: true,
	}).extend({
		_count: CountSchema(["reads", "likes"]),
	}),
);
export type AuthorGetChaptersListOutputType = z.infer<
	typeof AuthorGetChaptersListOutputSchema
>;

export const SwapChapterOrderInputSchema = z.object({
	chapter1: ChapterSchema.shape.slug,
	chapter2: ChapterSchema.shape.slug,
});
export type SwapChapterOrderInputType = z.infer<
	typeof SwapChapterOrderInputSchema
>;

export const SwapChapterOrderOutputSchema = z.object({
	chapter1: ChapterSchema.shape.slug,
	chapter2: ChapterSchema.shape.slug,
});
export type SwapChapterOrderOutputType = z.infer<
	typeof SwapChapterOrderOutputSchema
>;

export const DeleteChapterInputSchema = ChapterSchema.pick({
	slug: true,
	title: true,
});
export type DeleteChapterInputType = z.infer<typeof DeleteChapterInputSchema>;

export const DeleteChapterOutputSchema = UniqueChapterSchema;
export type DeleteChapterOutputType = z.infer<typeof DeleteChapterOutputSchema>;

export const UpdateChapterInputSchema = ChapterSchema.pick({
	title: true,
	description: true,
	status: true,
	slug: true,
})
	.partial()
	.required({ slug: true });
export type UpdateChapterInputType = z.infer<typeof UpdateChapterInputSchema>;

export const UpdateChapterOutputSchema = UniqueChapterSchema;
export type UpdateChapterOutputType = z.infer<typeof UpdateChapterOutputSchema>;

export const AuthorGetChapterContentInputSchema = UniqueChapterSchema;
export type AuthorGetChapterContentInputType = z.infer<
	typeof AuthorGetChapterContentInputSchema
>;

export const AuthorGetChapterContentOutputSchema = ChapterSchema.pick({
	content: true,
	draft: true,
	words: true,
	editedAt: true,
	publishedAt: true,
	lastPublishedAt: true,
});

export type AuthorGetChapterContentOutputType = z.infer<
	typeof AuthorGetChapterContentOutputSchema
>;

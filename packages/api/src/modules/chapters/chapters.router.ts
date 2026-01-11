import {
	AuthorGetChapterContentInputSchema,
	AuthorGetChapterContentOutputSchema,
	AuthorGetChapterInputSchema,
	AuthorGetChapterOutputSchema,
	AuthorGetChaptersListInputSchema,
	AuthorGetChaptersListOutputSchema,
	CreateChapterInputSchema,
	CreateChapterOutputSchema,
	DeleteChapterInputSchema,
	DeleteChapterOutputSchema,
	SwapChapterOrderInputSchema,
	SwapChapterOrderOutputSchema,
	UpdateChapterInputSchema,
	UpdateChapterOutputSchema,
} from "@encre/schemas";
import { authorProcedure } from "../../procedures";
import {
	authorGetManyChapters,
	authorGetOneChapter,
	authorGetOneChapterContent,
	createChapter,
	deleteChapter,
	swapChapterOrder,
	updateChapter,
} from "./services";

export const chaptersRouter = {
	createChapter: authorProcedure
		.input(CreateChapterInputSchema)
		.output(CreateChapterOutputSchema)
		.handler(
			async ({ input, context }) =>
				await createChapter(input, context.author.id),
		),
	deleteChapter: authorProcedure
		.input(DeleteChapterInputSchema)
		.output(DeleteChapterOutputSchema)
		.handler(
			async ({ input, context }) =>
				await deleteChapter(input, context.author.id),
		),
	updateChapter: authorProcedure
		.input(UpdateChapterInputSchema)
		.output(UpdateChapterOutputSchema)
		.handler(
			async ({ input, context }) =>
				await updateChapter(input, context.author.id),
		),
	swapChapterOrder: authorProcedure
		.input(SwapChapterOrderInputSchema)
		.output(SwapChapterOrderOutputSchema)
		.handler(
			async ({ input, context }) =>
				await swapChapterOrder(input, context.author.id),
		),
	authorGetChaptersList: authorProcedure
		.input(AuthorGetChaptersListInputSchema)
		.output(AuthorGetChaptersListOutputSchema)
		.handler(
			async ({ input, context }) =>
				await authorGetManyChapters(input, context.author.id),
		),
	authorGetChapter: authorProcedure
		.input(AuthorGetChapterInputSchema)
		.output(AuthorGetChapterOutputSchema)
		.handler(
			async ({ input, context }) =>
				await authorGetOneChapter(input, context.author.id),
		),

	// CONTENT
	authorGetChapterContent: authorProcedure
		.input(AuthorGetChapterContentInputSchema)
		.output(AuthorGetChapterContentOutputSchema)
		.handler(
			async ({ input, context }) =>
				await authorGetOneChapterContent(input, context.author.id),
		),
};

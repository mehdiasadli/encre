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
import { ChaptersService } from "./chapters.service";
import { ChaptersContentService } from "./chapters-content.service";

export const chaptersRouter = {
	createChapter: authorProcedure
		.input(CreateChapterInputSchema)
		.output(CreateChapterOutputSchema)
		.handler(
			async ({ input, context }) =>
				await ChaptersService.createChapter(input, context.author.id),
		),
	deleteChapter: authorProcedure
		.input(DeleteChapterInputSchema)
		.output(DeleteChapterOutputSchema)
		.handler(
			async ({ input, context }) =>
				await ChaptersService.deleteChapter(input, context.author.id),
		),
	updateChapter: authorProcedure
		.input(UpdateChapterInputSchema)
		.output(UpdateChapterOutputSchema)
		.handler(
			async ({ input, context }) =>
				await ChaptersService.updateChapter(input, context.author.id),
		),
	swapChapterOrder: authorProcedure
		.input(SwapChapterOrderInputSchema)
		.output(SwapChapterOrderOutputSchema)
		.handler(
			async ({ input, context }) =>
				await ChaptersService.swapChapterOrder(input, context.author.id),
		),
	authorGetChaptersList: authorProcedure
		.input(AuthorGetChaptersListInputSchema)
		.output(AuthorGetChaptersListOutputSchema)
		.handler(
			async ({ input, context }) =>
				await ChaptersService.authorGetChaptersList(input, context.author.id),
		),
	authorGetChapter: authorProcedure
		.input(AuthorGetChapterInputSchema)
		.output(AuthorGetChapterOutputSchema)
		.handler(
			async ({ input, context }) =>
				await ChaptersService.authorGetChapter(input, context.author.id),
		),

	// CONTENT
	authorGetChapterContent: authorProcedure
		.input(AuthorGetChapterContentInputSchema)
		.output(AuthorGetChapterContentOutputSchema)
		.handler(
			async ({ input, context }) =>
				await ChaptersContentService.authorGetChapterContent(
					input,
					context.author.id,
				),
		),
};

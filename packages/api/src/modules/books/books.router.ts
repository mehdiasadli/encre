import {
	AuthorGetBookInputSchema,
	AuthorGetBookOutputSchema,
	AuthorGetBooksListInputSchema,
	AuthorGetBooksListOutputSchema,
	CreateBookInputSchema,
	CreateBookOutputSchema,
	DeleteBookInputSchema,
	DeleteBookOutputSchema,
	SwapBookOrderInputSchema,
	SwapBookOrderOutputSchema,
	UpdateBookInputSchema,
	UpdateBookOutputSchema,
} from "@encre/schemas";
import { authorProcedure } from "../../procedures";
import { BooksService } from "./books.service";

export const booksRouter = {
	authorGetBooksList: authorProcedure
		.input(AuthorGetBooksListInputSchema)
		.output(AuthorGetBooksListOutputSchema)
		.handler(
			async ({ input, context }) =>
				await BooksService.authorGetBooksList(input, context.author.id),
		),
	authorGetBook: authorProcedure
		.input(AuthorGetBookInputSchema)
		.output(AuthorGetBookOutputSchema)
		.handler(
			async ({ input, context }) =>
				await BooksService.authorGetBook(input, context.author.id),
		),
	updateBook: authorProcedure
		.input(UpdateBookInputSchema)
		.output(UpdateBookOutputSchema)
		.handler(
			async ({ input, context }) =>
				await BooksService.updateBook(input, context.author.id),
		),
	swapBookOrder: authorProcedure
		.input(SwapBookOrderInputSchema)
		.output(SwapBookOrderOutputSchema)
		.handler(
			async ({ input, context }) =>
				await BooksService.swapBookOrder(input, context.author.id),
		),
	deleteBook: authorProcedure
		.input(DeleteBookInputSchema)
		.output(DeleteBookOutputSchema)
		.handler(
			async ({ input, context }) =>
				await BooksService.deleteBook(input, context.author.id),
		),
	createBook: authorProcedure
		.input(CreateBookInputSchema)
		.output(CreateBookOutputSchema)
		.handler(
			async ({ input, context }) =>
				await BooksService.createBook(input, context.author.id),
		),
};

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
import {
	authorGetManyBooks,
	authorGetOneBook,
	createBook,
	deleteBook,
	swapBookOrder,
	updateBook,
} from "./services";

export const booksRouter = {
	authorGetBooksList: authorProcedure
		.input(AuthorGetBooksListInputSchema)
		.output(AuthorGetBooksListOutputSchema)
		.handler(
			async ({ input, context }) =>
				await authorGetManyBooks(input, context.author.id),
		),
	authorGetBook: authorProcedure
		.input(AuthorGetBookInputSchema)
		.output(AuthorGetBookOutputSchema)
		.handler(
			async ({ input, context }) =>
				await authorGetOneBook(input, context.author.id),
		),
	updateBook: authorProcedure
		.input(UpdateBookInputSchema)
		.output(UpdateBookOutputSchema)
		.handler(
			async ({ input, context }) => await updateBook(input, context.author.id),
		),
	swapBookOrder: authorProcedure
		.input(SwapBookOrderInputSchema)
		.output(SwapBookOrderOutputSchema)
		.handler(
			async ({ input, context }) =>
				await swapBookOrder(input, context.author.id),
		),
	deleteBook: authorProcedure
		.input(DeleteBookInputSchema)
		.output(DeleteBookOutputSchema)
		.handler(
			async ({ input, context }) => await deleteBook(input, context.author.id),
		),
	createBook: authorProcedure
		.input(CreateBookInputSchema)
		.output(CreateBookOutputSchema)
		.handler(
			async ({ input, context }) => await createBook(input, context.author.id),
		),
};

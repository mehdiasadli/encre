import prisma, { type Prisma } from "@encre/db";
import type {
	SwapBookOrderInputType,
	SwapBookOrderOutputType,
	UpdateBookInputType,
} from "@encre/schemas";
import { ORPCError } from "@orpc/client";
import {
	handleBookStatusChange,
	handleBookTitleChange,
} from "../books.helpers";

export async function updateBook(input: UpdateBookInputType, authorId: string) {
	const { title, description, status, slug } = input;

	const book = await prisma.book.findUnique({
		where: {
			slug,
			authorId,
			status: { not: "deleted" },
		},
		select: {
			id: true,
			title: true,
			authorId: true,
			slug: true,
			serie: { select: { status: true } },
			status: true,
		},
	});

	if (!book) {
		throw new ORPCError("NOT_FOUND", {
			message: "Book not found",
		});
	}

	if (book.serie.status === "cancelled") {
		throw new ORPCError("BAD_REQUEST", {
			message:
				"Serie is cancelled. You cannot update a book in a cancelled serie.",
		});
	}

	if (book.status === "cancelled") {
		throw new ORPCError("BAD_REQUEST", {
			message: "Book is cancelled. You cannot update a cancelled book.",
		});
	}

	const updatedSlug = await handleBookTitleChange(book, title);
	await handleBookStatusChange(book, status);

	return await prisma.book.update({
		where: { slug },
		data: {
			title: title ?? undefined,
			description: description ?? undefined,
			status: status ?? undefined,
			slug: updatedSlug,
		},
		select: {
			slug: true,
		},
	});
}

export async function swapBookOrder(
	input: SwapBookOrderInputType,
	authorId: string,
): Promise<SwapBookOrderOutputType> {
	const findUniqueInput = (slug: string): Prisma.BookFindUniqueArgs => ({
		where: { slug, authorId, status: { not: "deleted" } },
		select: { id: true, serieId: true, order: true, slug: true },
	});

	const [book1, book2] = await prisma.$transaction([
		prisma.book.findUnique(findUniqueInput(input.book1)),
		prisma.book.findUnique(findUniqueInput(input.book2)),
	]);

	if (!book1 || !book2) {
		throw new ORPCError("NOT_FOUND", {
			message: "One of the books (or both) not found",
		});
	}

	if (book1.serieId !== book2.serieId) {
		throw new ORPCError("BAD_REQUEST", {
			message: "Books are not in the same serie",
		});
	}

	await prisma.$transaction(async (tx) => {
		await tx.book.update({
			where: { id: book1.id },
			data: { order: -1000 /** temporary order to avoid conflicts */ },
		});

		await tx.book.update({
			where: { id: book2.id },
			data: { order: book1.order },
		});

		await tx.book.update({
			where: { id: book1.id },
			data: { order: book2.order },
		});
	});

	return {
		book1: book1.slug,
		book2: book2.slug,
	};
}

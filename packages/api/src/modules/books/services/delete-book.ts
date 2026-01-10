import prisma from "@encre/db";
import type { DeleteBookInputType, DeleteBookOutputType } from "@encre/schemas";
import { ORPCError } from "@orpc/client";

export async function deleteBook(
	input: DeleteBookInputType,
	authorId: string,
): Promise<DeleteBookOutputType> {
	const book = await prisma.book.findUnique({
		where: { slug: input.slug, authorId, status: { not: "deleted" } },
		select: { id: true, slug: true, title: true, serieId: true, order: true },
	});

	if (!book) {
		throw new ORPCError("NOT_FOUND", {
			message: "Book not found",
		});
	}

	if (book.title !== input.title) {
		throw new ORPCError("BAD_REQUEST", {
			message: "Book title does not match",
		});
	}

	await prisma.$transaction(async (tx) => {
		const data = {
			status: "deleted",
			deletionReason: "book",
			deletedAt: new Date(),
		} as const;

		const currentOrder = book.order;

		const lastDeletedBook = await tx.book.findFirst({
			where: { serieId: book.serieId, status: "deleted" },
			orderBy: { deletedAt: "desc" },
		});

		await tx.book.update({
			where: { id: book.id, status: { not: "deleted" } },
			data: {
				...data,
				order: lastDeletedBook ? lastDeletedBook.order - 1 : -1,
			},
		});

		// delete all the chapters
		await tx.chapter.updateMany({
			where: { bookId: book.id, status: { not: "deleted" } },
			data,
		});

		// fix the order of the books
		// books before deleted book remains the same
		// books after deleted book decremented by 1
		await tx.book.updateMany({
			where: {
				serieId: book.serieId,
				status: { not: "deleted" },
				order: { gt: currentOrder },
			},
			data: { order: { decrement: 1 } },
		});
	});

	return {
		slug: book.slug,
	};
}

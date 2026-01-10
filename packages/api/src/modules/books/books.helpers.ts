import prisma from "@encre/db";
import { env } from "@encre/env/server";
import type { ResourceStatusType } from "@encre/schemas/models/inputTypeSchemas/ResourceStatusSchema";
import { generateUniqueSlug } from "@encre/utils";
import { ORPCError } from "@orpc/client";
import {
	validateAuthorResourceStatusUpdate,
	validateResourceTitle,
} from "../shared.service";

export async function checkBookLimit(authorId: string) {
	const currentBookCount = await prisma.book.count({
		where: {
			authorId,
			status: { not: "deleted" },
		},
	});

	if (currentBookCount >= env.MAX_BOOKS_PER_SERIE) {
		throw new ORPCError("BAD_REQUEST", {
			message: `You have reached the maximum number of books (${env.MAX_BOOKS_PER_SERIE} per author). You cannot create more books.`,
		});
	}
}

export async function handleBookTitleChange(
	book: { id: string; title?: string },
	newTitle?: string,
) {
	if (!newTitle || book.title === newTitle) return undefined;

	validateResourceTitle(newTitle);

	return await generateUniqueSlug(newTitle, async (slug) => {
		const book = await prisma.book.findUnique({
			where: { slug },
			select: { id: true, status: true, slug: true },
		});

		if (!book) return null;
		if (book.status !== "deleted") return book;

		await prisma.book.update({
			where: { id: book.id },
			data: {
				slug: `${slug}-deleted-${Math.random().toString(36).slice(4, 8)}`,
			},
		});

		return null;
	});
}

export async function handleBookStatusChange(
	book: { id: string; status: ResourceStatusType },
	newStatus: ResourceStatusType | undefined,
) {
	await validateAuthorResourceStatusUpdate(book.status, newStatus, async () => {
		const [publishedChapterCount] = await prisma.$transaction([
			prisma.chapter.count({
				where: { bookId: book.id, status: "published" },
			}),
		]);

		if (publishedChapterCount === 0) {
			throw new ORPCError("BAD_REQUEST", {
				message:
					"Book cannot be published because it has no published chapters. Please publish at least one chapter before publishing this book.",
			});
		}
	});
}

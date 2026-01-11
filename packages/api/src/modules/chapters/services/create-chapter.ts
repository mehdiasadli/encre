import prisma from "@encre/db";
import type {
	CreateChapterInputType,
	CreateChapterOutputType,
} from "@encre/schemas";
import { generateUniqueSlug } from "@encre/utils";
import { ORPCError } from "@orpc/client";
import { validateResourceTitle } from "../../shared.service";
import { checkChapterLimit } from "../chapters.helpers";

export async function createChapter(
	input: CreateChapterInputType,
	authorId: string,
): Promise<CreateChapterOutputType> {
	const book = await prisma.book.findUnique({
		where: { authorId, slug: input.book, status: { not: "deleted" } },
		select: {
			status: true,
			id: true,
			serie: { select: { status: true, id: true } },
		},
	});

	if (!book) {
		throw new ORPCError("NOT_FOUND", {
			message: "Book not found",
		});
	}

	if (book.status === "cancelled") {
		throw new ORPCError("BAD_REQUEST", {
			message:
				"Book is cancelled. You cannot add a chapter to a cancelled book.",
		});
	}

	if (book.serie.status === "cancelled") {
		throw new ORPCError("BAD_REQUEST", {
			message:
				"Serie is cancelled. You cannot add a chapter to a cancelled serie.",
		});
	}

	await checkChapterLimit(book.id);
	validateResourceTitle(input.title);

	const existingChapter = await prisma.chapter.findFirst({
		where: {
			title: input.title,
			bookId: book.id,
		},
	});

	if (existingChapter) {
		throw new ORPCError("BAD_REQUEST", {
			message: "Chapter with the same title already exists in this book.",
			data: { path: "title" },
		});
	}

	// generate the order
	const chapterCount = await prisma.chapter.count({
		where: { bookId: book.id, status: { not: "deleted" } },
	});
	const order = chapterCount + 1;

	return await prisma.chapter.create({
		data: {
			title: input.title,
			description: input.description,
			authorId,
			serieId: book.serie.id,
			bookId: book.id,
			order,
			content: "",
			slug: await generateUniqueSlug(
				input.title,
				async (slug) => await prisma.chapter.findUnique({ where: { slug } }),
			),
		},
		select: {
			slug: true,
		},
	});
}

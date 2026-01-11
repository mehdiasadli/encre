import prisma, { type Prisma } from "@encre/db";
import type {
	SwapChapterOrderInputType,
	SwapChapterOrderOutputType,
	UpdateChapterInputType,
	UpdateChapterOutputType,
} from "@encre/schemas";
import { ORPCError } from "@orpc/client";
import {
	handleChapterStatusChange,
	handleChapterTitleChange,
} from "../chapters.helpers";

export async function updateChapter(
	input: UpdateChapterInputType,
	authorId: string,
): Promise<UpdateChapterOutputType> {
	const chapter = await prisma.chapter.findUnique({
		where: { slug: input.slug, authorId, status: { not: "deleted" } },
		select: {
			id: true,
			slug: true,
			title: true,
			description: true,
			status: true,
			book: { select: { status: true, serie: { select: { status: true } } } },
		},
	});

	if (!chapter) {
		throw new ORPCError("NOT_FOUND", {
			message: "Chapter not found",
		});
	}

	if (chapter.status === "cancelled") {
		throw new ORPCError("BAD_REQUEST", {
			message: "Chapter is cancelled. You cannot update a cancelled chapter.",
		});
	}

	if (chapter.book.status === "cancelled") {
		throw new ORPCError("BAD_REQUEST", {
			message:
				"Book is cancelled. You cannot update a chapter in a cancelled book.",
		});
	}

	if (chapter.book.serie.status === "cancelled") {
		throw new ORPCError("BAD_REQUEST", {
			message:
				"Serie is cancelled. You cannot update a chapter in a cancelled serie.",
		});
	}

	const updatedSlug = await handleChapterTitleChange(chapter, input.title);
	await handleChapterStatusChange(chapter, input.status);

	return await prisma.chapter.update({
		where: { slug: input.slug },
		data: {
			title: input.title,
			description: input.description,
			status: input.status,
			slug: updatedSlug,
		},
		select: {
			slug: true,
		},
	});
}

export async function swapChapterOrder(
	input: SwapChapterOrderInputType,
	authorId: string,
): Promise<SwapChapterOrderOutputType> {
	const findUniqueInput = (slug: string): Prisma.ChapterFindUniqueArgs => ({
		where: { slug, authorId, status: { not: "deleted" } },
		select: { id: true, bookId: true, order: true, slug: true },
	});

	const [chapter1, chapter2] = await prisma.$transaction([
		prisma.chapter.findUnique(findUniqueInput(input.chapter1)),
		prisma.chapter.findUnique(findUniqueInput(input.chapter2)),
	]);

	if (!chapter1 || !chapter2) {
		throw new ORPCError("NOT_FOUND", {
			message: "One of the chapters (or both) not found",
		});
	}

	if (chapter1.bookId !== chapter2.bookId) {
		throw new ORPCError("BAD_REQUEST", {
			message: "Chapters are not in the same book",
		});
	}

	await prisma.$transaction(async (tx) => {
		await tx.chapter.update({
			where: { id: chapter1.id },
			data: { order: -1000 /** temporary order to avoid conflicts */ },
		});

		await tx.chapter.update({
			where: { id: chapter2.id },
			data: { order: chapter1.order },
		});

		await tx.chapter.update({
			where: { id: chapter1.id },
			data: { order: chapter2.order },
		});
	});

	return {
		chapter1: chapter1.slug,
		chapter2: chapter2.slug,
	};
}

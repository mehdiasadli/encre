import prisma from "@encre/db";
import type {
	AuthorGetChapterContentInputType,
	AuthorGetChapterContentOutputType,
	AuthorGetChapterInputType,
	AuthorGetChapterOutputType,
} from "@encre/schemas";
import type { ResourceStatusType } from "@encre/schemas/models/inputTypeSchemas/ResourceStatusSchema";
import { ORPCError } from "@orpc/client";

export async function authorGetOneChapter(
	input: AuthorGetChapterInputType,
	authorId: string,
): Promise<AuthorGetChapterOutputType> {
	const chapter = await prisma.chapter.findUnique({
		where: {
			authorId,
			status: { not: "deleted" },
			slug: input.slug,
		},
		omit: {
			authorId: true,
			bookId: true,
			serieId: true,
			deletedAt: true,
			deletionReason: true,
			id: true,
			content: true,
			draft: true,
		},

		include: {
			_count: {
				select: {
					reads: true,
					likes: true,
				},
			},
		},
	});

	if (!chapter) {
		throw new ORPCError("NOT_FOUND", {
			message: "Chapter not found",
		});
	}

	return {
		...chapter,
		status: chapter.status as Exclude<ResourceStatusType, "deleted">,
	};
}

export async function authorGetOneChapterContent(
	input: AuthorGetChapterContentInputType,
	authorId: string,
): Promise<AuthorGetChapterContentOutputType> {
	const chapter = await prisma.chapter.findUnique({
		where: {
			slug: input.slug,
			status: { not: "deleted" },
			authorId,
		},
		select: {
			content: true,
			draft: true,
			words: true,
			editedAt: true,
			publishedAt: true,
			lastPublishedAt: true,
		},
	});

	if (!chapter) {
		throw new ORPCError("NOT_FOUND", {
			message: "Chapter not found",
		});
	}

	return chapter;
}

import prisma from "@encre/db";
import type {
	DeleteChapterInputType,
	DeleteChapterOutputType,
} from "@encre/schemas";
import { ORPCError } from "@orpc/client";

export async function deleteChapter(
	input: DeleteChapterInputType,
	authorId: string,
): Promise<DeleteChapterOutputType> {
	const chapter = await prisma.chapter.findUnique({
		where: { slug: input.slug, authorId, status: { not: "deleted" } },
		select: { id: true, slug: true, title: true, bookId: true, order: true },
	});

	if (!chapter) {
		throw new ORPCError("NOT_FOUND", {
			message: "Chapter not found",
		});
	}

	if (chapter.title !== input.title) {
		throw new ORPCError("BAD_REQUEST", {
			message: "Chapter title does not match",
		});
	}

	await prisma.$transaction(async (tx) => {
		const data = {
			status: "deleted",
			deletionReason: "chapter",
			deletedAt: new Date(),
		} as const;

		const currentOrder = chapter.order;

		const lastDeletedChapter = await tx.chapter.findFirst({
			where: { bookId: chapter.bookId, status: "deleted" },
			orderBy: { deletedAt: "desc" },
		});

		await tx.chapter.update({
			where: { id: chapter.id },
			data: {
				...data,
				order: lastDeletedChapter ? lastDeletedChapter.order - 1 : -1,
			},
		});

		// fix the order of the chapters
		// chapters before deleted chapter remains the same
		// chapters after deleted chapter decremented by 1
		await tx.chapter.updateMany({
			where: {
				bookId: chapter.bookId,
				status: { not: "deleted" },
				order: { gt: currentOrder },
			},
			data: { order: { decrement: 1 } },
		});
	});

	return {
		slug: chapter.slug,
	};
}

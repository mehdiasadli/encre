import prisma from "@encre/db";
import type {
	AuthorGetChapterContentInputType,
	AuthorGetChapterContentOutputType,
} from "@encre/schemas";
import { ORPCError } from "@orpc/client";

export class ChaptersContentService {
	static async authorGetChapterContent(
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
}

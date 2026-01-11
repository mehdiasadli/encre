import { LIMITS } from "@encre/constants";
import prisma from "@encre/db";
import type { ResourceStatusType } from "@encre/schemas/models/inputTypeSchemas/ResourceStatusSchema";
import { generateUniqueSlug } from "@encre/utils";
import { ORPCError } from "@orpc/client";
import {
	validateAuthorResourceStatusUpdate,
	validateResourceTitle,
} from "../shared.service";

export async function checkChapterLimit(bookId: string) {
	const currentChapterCount = await prisma.chapter.count({
		where: {
			bookId,
			status: { not: "deleted" },
		},
	});

	if (currentChapterCount >= LIMITS.MAX_CHAPTERS_PER_BOOK) {
		throw new ORPCError("BAD_REQUEST", {
			message: `You have reached the maximum number of chapters (${LIMITS.MAX_CHAPTERS_PER_BOOK} per book). You cannot add more chapters.`,
		});
	}
}

export async function handleChapterTitleChange(
	chapter: { id: string; title?: string },
	newTitle?: string,
) {
	if (!newTitle || chapter.title === newTitle) return undefined;

	validateResourceTitle(newTitle);

	return await generateUniqueSlug(newTitle, async (slug) => {
		const chapter = await prisma.chapter.findUnique({
			where: { slug },
			select: { id: true, status: true, slug: true },
		});

		if (!chapter) return null;
		if (chapter.status !== "deleted") return chapter;

		await prisma.chapter.update({
			where: { id: chapter.id },
			data: {
				slug: `${slug}-deleted-${Math.random().toString(36).slice(4, 8)}`,
			},
		});

		return null;
	});
}

export async function handleChapterStatusChange(
	chapter: { id: string; status: ResourceStatusType },
	newStatus: ResourceStatusType | undefined,
) {
	await validateAuthorResourceStatusUpdate(
		chapter.status,
		newStatus,
		async () => {
			// check if there is content in the chapter
			const { content } =
				(await prisma.chapter.findUnique({
					where: { id: chapter.id, status: { not: "deleted" } },
					select: { content: true },
				})) ?? {};

			if (!content || content.trim() === "") {
				throw new ORPCError("BAD_REQUEST", {
					message:
						"Chapter cannot be published because it has no content. Please add content to the chapter before publishing it.",
				});
			}
		},
	);
}

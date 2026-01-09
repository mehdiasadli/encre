import prisma from "@encre/db";
import { env } from "@encre/env/server";
import type { ResourceStatusType } from "@encre/schemas/models/inputTypeSchemas/ResourceStatusSchema";
import { generateUniqueSlug } from "@encre/utils";
import { ORPCError } from "@orpc/client";
import {
	validateAuthorResourceStatusUpdate,
	validateResourceTitle,
} from "../shared.service";

export async function checkSerieLimit(authorId: string) {
	const currentSeriesCount = await prisma.serie.count({
		where: { authorId, status: { not: "deleted" } },
	});

	if (currentSeriesCount > env.MAX_SERIES_PER_AUTHOR) {
		throw new ORPCError("BAD_REQUEST", {
			message: `You have reached the maximum number of series (${env.MAX_SERIES_PER_AUTHOR} per author). You cannot create more series.`,
		});
	}
}

export async function handleSerieTitleChange(
	serie: { id: string; title?: string },
	newTitle?: string,
) {
	if (!newTitle || serie.title === newTitle) return undefined;

	validateResourceTitle(newTitle);

	return await generateUniqueSlug(newTitle, async (slug) => {
		const serie = await prisma.serie.findUnique({
			where: { slug },
			select: { id: true, status: true, slug: true },
		});

		if (!serie) return null;
		if (serie.status !== "deleted") return serie;

		await prisma.serie.update({
			where: { id: serie.id },
			data: {
				slug: `${slug}-deleted-${Math.random().toString(36).slice(4, 8)}`,
			},
		});

		return null;
	});
}

export async function handleSerieStatusChange(
	serie: { id: string; status: ResourceStatusType },
	newStatus: ResourceStatusType | undefined,
) {
	validateAuthorResourceStatusUpdate(serie.status, newStatus, async () => {
		const [publishedBookCount, publishedChapterCount] =
			await prisma.$transaction([
				prisma.book.count({
					where: { serieId: serie.id, status: "published" },
				}),
				prisma.chapter.count({
					where: { book: { serieId: serie.id, status: "published" } },
				}),
			]);

		if (publishedBookCount === 0 || publishedChapterCount === 0) {
			throw new ORPCError("BAD_REQUEST", {
				message:
					"Serie cannot be published because it has no published books or chapters. Please publish at least one book and one chapter before publishing this serie.",
			});
		}
	});
}

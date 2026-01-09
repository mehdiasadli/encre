import prisma from "@encre/db";
import { env } from "@encre/env/server";
import type {
	AuthorGetSeriesListOutputType,
	CreateSerieInputType,
	CreateSerieOutputType,
	DeleteSerieInputType,
	DeleteSerieOutputType,
	GetSerieInputType,
	GetSerieOutputType,
	UpdateSerieInputType,
	UpdateSerieOutputType,
} from "@encre/schemas";
import type { ResourceStatusType } from "@encre/schemas/models/inputTypeSchemas/ResourceStatusSchema";
import { generateUniqueSlug, resourceTitleBlocklist } from "@encre/utils";
import { ORPCError } from "@orpc/client";
// import { logger } from '@encre/logger';

export class SeriesService {
	////
	// HELPERS
	////
	static validateSerieTitle(title: string) {
		console.log({
			title,
			blocklist: resourceTitleBlocklist,
			result: resourceTitleBlocklist.some((word) =>
				title.toLowerCase().includes(word.toLowerCase()),
			),
		});

		if (
			resourceTitleBlocklist.some((word) =>
				title.toLowerCase().includes(word.toLowerCase()),
			)
		) {
			throw new ORPCError("BAD_REQUEST", {
				message:
					"Title contains blocked words. Please choose a different title.",
				data: {
					path: ["title"],
				},
			});
		}
	}

	static async checkSerieLimit(authorId: string) {
		const currentSeriesCount = await prisma.serie.count({
			where: { authorId, status: { not: "deleted" } },
		});

		if (currentSeriesCount > env.MAX_SERIES_PER_AUTHOR) {
			throw new ORPCError("BAD_REQUEST", {
				message: `You have reached the maximum number of series (${env.MAX_SERIES_PER_AUTHOR} per author). You cannot create more series.`,
			});
		}
	}

	static async handleTitleChange(
		serie: { id: string; title: string | undefined },
		newTitle: string | undefined,
	) {
		if (!newTitle || serie.title === newTitle) return undefined;

		SeriesService.validateSerieTitle(newTitle);

		const updatedSlug = await generateUniqueSlug(newTitle, async (slug) => {
			const existingSerie = await prisma.serie.findUnique({
				where: { slug },
				select: { id: true, status: true, slug: true },
			});

			if (!existingSerie) return null;
			if (existingSerie.status === "deleted") {
				await prisma.serie.update({
					where: { id: existingSerie.id },
					data: {
						slug: `${slug}-deleted-${Math.random().toString(36).slice(4, 8)}`,
					},
				});

				return null;
			}

			return existingSerie;
		});

		return updatedSlug;
	}

	static async handleStatusChange(
		serie: { id: string; status: ResourceStatusType },
		newStatus: ResourceStatusType | undefined,
	) {
		if (!newStatus || serie.status === newStatus) return undefined;

		const statusMap: Record<
			Exclude<ResourceStatusType, "deleted">,
			Exclude<ResourceStatusType, "deleted">[]
		> = {
			draft: ["published", "coming_soon", "cancelled"],
			archived: ["published"],
			cancelled: ["archived"],
			coming_soon: ["published", "cancelled"],
			published: ["archived", "cancelled"],
		};

		if (!statusMap[newStatus as Exclude<ResourceStatusType, "deleted">]) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Invalid status",
			});
		}

		if (newStatus === "published") {
			// check if serie has books and chapters
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
		}
	}

	////
	// QUERIES
	////
	static async authorGetSeriesList(
		authorId: string,
	): Promise<AuthorGetSeriesListOutputType> {
		const series = await prisma.serie.findMany({
			where: {
				authorId,
				status: { not: "deleted" },
			},
			orderBy: {
				updatedAt: "desc",
			},
			select: {
				title: true,
				slug: true,
				status: true,
				visibility: true,
			},
		});

		return series;
	}

	static async authorGetSerie(
		input: GetSerieInputType,
		authorId: string,
	): Promise<GetSerieOutputType> {
		const serie = await prisma.serie.findFirst({
			where: {
				authorId,
				status: { not: "deleted" },
				slug: input.slug,
			},
			omit: {
				authorId: true,
				deletedAt: true,
				deletionReason: true,
				id: true,
			},
			include: {
				author: {
					select: {
						name: true,
						slug: true,
						image: true,
					},
				},
				_count: {
					select: {
						books: true,
						likes: true,
					},
				},
			},
		});

		if (!serie) {
			throw new ORPCError("NOT_FOUND", {
				message: "Serie not found",
			});
		}

		return serie;
	}

	////
	// MUTATIONS
	////

	static async createSerie(
		input: CreateSerieInputType,
		authorId: string,
	): Promise<CreateSerieOutputType> {
		await SeriesService.checkSerieLimit(authorId);
		SeriesService.validateSerieTitle(input.title);

		// check if author has already a serie with the same title
		const existingSerie = await prisma.serie.findFirst({
			where: {
				title: input.title,
				authorId,
				status: { not: "deleted" },
			},
		});

		if (existingSerie) {
			throw new ORPCError("BAD_REQUEST", {
				message: "You already have a serie with the same title",
				data: {
					path: ["title"],
				},
			});
		}

		return await prisma.serie.create({
			data: {
				title: input.title,
				slug: await generateUniqueSlug(
					input.title,
					async (slug) =>
						await prisma.serie.findUnique({
							where: { slug },
						}),
				),
				description: input.description,
				authorId,
			},
			select: {
				slug: true,
			},
		});
	}

	static async deleteSerie(
		input: DeleteSerieInputType,
		authorId: string,
	): Promise<DeleteSerieOutputType> {
		const serie = await prisma.serie.findUnique({
			where: { slug: input.slug, authorId, status: { not: "deleted" } },
			select: { authorId: true, slug: true, id: true, title: true },
		});

		if (!serie) {
			throw new ORPCError("NOT_FOUND", {
				message: "Serie not found",
			});
		}

		if (serie.title !== input.title) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Serie title does not match",
			});
		}

		await prisma.$transaction(async (tx) => {
			const data = {
				status: "deleted",
				deletionReason: "serie",
				deletedAt: new Date(),
			} as const;

			await tx.serie.update({
				where: { id: serie.id },
				data,
			});

			// delete all the books
			await tx.book.updateMany({
				where: { serieId: serie.id, status: { not: "deleted" } },
				data,
			});

			// delete all the chapters
			await tx.chapter.updateMany({
				where: { book: { serieId: serie.id, status: { not: "deleted" } } },
				data,
			});

			// delete all the characters
			await tx.character.updateMany({
				where: { serieId: serie.id, status: { not: "deleted" } },
				data,
			});
		});

		return {
			slug: serie.slug,
		};
	}

	static async updateSerie(
		input: UpdateSerieInputType,
		authorId: string,
	): Promise<UpdateSerieOutputType> {
		const { title, description, status, visibility, slug } = input;

		const serie = await prisma.serie.findUnique({
			where: { slug, authorId, status: { not: "deleted" } },
			select: {
				id: true,
				title: true,
				authorId: true,
				slug: true,
				status: true,
			},
		});

		if (!serie) {
			throw new ORPCError("NOT_FOUND", {
				message: "Serie not found",
			});
		}

		if (serie.status === "cancelled") {
			throw new ORPCError("BAD_REQUEST", {
				message: "Serie is cancelled. You cannot update a cancelled serie.",
			});
		}

		const updatedSlug = await SeriesService.handleTitleChange(serie, title);
		await SeriesService.handleStatusChange(serie, status);

		return await prisma.serie.update({
			where: { slug },
			data: {
				title,
				description: description ?? undefined,
				status: status ?? undefined,
				visibility: visibility ?? undefined,
				slug: updatedSlug,
			},
			select: {
				slug: true,
			},
		});
	}
}

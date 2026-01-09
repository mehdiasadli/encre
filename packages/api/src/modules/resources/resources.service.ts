import prisma from "@encre/db";
import type {
	AuthorSearchResourceInputType,
	AuthorSearchResourceOutputType,
} from "@encre/schemas";
import { ORPCError } from "@orpc/client";

export class ResourcesService {
	////
	// HELPERS
	////
	private static async searchSeries(
		query: string,
		authorId: string,
	): Promise<AuthorSearchResourceOutputType["items"]> {
		const series = await prisma.serie.findMany({
			where: {
				authorId,
				status: { not: "deleted" },
				OR: [
					{ title: { contains: query, mode: "insensitive" } },
					{ slug: { contains: query, mode: "insensitive" } },
					{ description: { contains: query, mode: "insensitive" } },
				],
			},
			take: 5,
			select: { slug: true, title: true, description: true },
		});

		return series.map((s) => ({
			...s,
			url: `/dashboard/author/series/${s.slug}`,
		}));
	}

	private static async searchBooks(
		query: string,
		authorId: string,
	): Promise<AuthorSearchResourceOutputType["items"]> {
		const books = await prisma.book.findMany({
			where: {
				authorId,
				status: { not: "deleted" },
				OR: [
					{ title: { contains: query, mode: "insensitive" } },
					{ slug: { contains: query, mode: "insensitive" } },
					{ description: { contains: query, mode: "insensitive" } },
				],
			},
			take: 5,
			select: {
				slug: true,
				title: true,
				description: true,
				serie: { select: { slug: true } },
			},
		});

		return books.map(({ serie, ...b }) => ({
			...b,
			url: `/dashboard/author/series/${serie.slug}/books/${b.slug}`,
		}));
	}

	private static async searchChapters(
		query: string,
		authorId: string,
	): Promise<AuthorSearchResourceOutputType["items"]> {
		const chapters = await prisma.chapter.findMany({
			where: {
				authorId,
				status: { not: "deleted" },
				OR: [
					{ title: { contains: query, mode: "insensitive" } },
					{ slug: { contains: query, mode: "insensitive" } },
					{ description: { contains: query, mode: "insensitive" } },
				],
			},
			take: 5,
			select: {
				slug: true,
				title: true,
				description: true,
				book: { select: { slug: true, serie: { select: { slug: true } } } },
			},
		});

		return chapters.map(({ book, ...c }) => ({
			...c,
			url: `/dashboard/author/series/${book.serie.slug}/books/${book.slug}/chapters/${c.slug}`,
		}));
	}

	private static async searchCharacters(
		query: string,
		authorId: string,
	): Promise<AuthorSearchResourceOutputType["items"]> {
		const characters = await prisma.character.findMany({
			where: {
				serie: { authorId },
				status: { not: "deleted" },
				OR: [
					{ name: { contains: query, mode: "insensitive" } },
					{ firstName: { contains: query, mode: "insensitive" } },
					{ lastName: { contains: query, mode: "insensitive" } },
					{ slug: { contains: query, mode: "insensitive" } },
					{ description: { contains: query, mode: "insensitive" } },
				],
			},
			take: 5,
			select: {
				slug: true,
				name: true,
				firstName: true,
				lastName: true,
				description: true,
				serie: { select: { slug: true } },
			},
		});

		return characters.map(({ serie, ...c }) => ({
			title:
				c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : c.name,
			slug: c.slug,
			description: c.description,
			url: `/dashboard/author/series/${serie.slug}/characters/${c.slug}`,
		}));
	}

	private static async searchPlaces(
		query: string,
		authorId: string,
	): Promise<AuthorSearchResourceOutputType["items"]> {
		const places = await prisma.place.findMany({
			where: {
				serie: { authorId, status: { not: "deleted" } },
				OR: [
					{ name: { contains: query, mode: "insensitive" } },
					{ address: { contains: query, mode: "insensitive" } },
					{ slug: { contains: query, mode: "insensitive" } },
					{ description: { contains: query, mode: "insensitive" } },
				],
			},
			take: 5,
			select: {
				slug: true,
				name: true,
				address: true,
				description: true,
				serie: { select: { slug: true } },
			},
		});

		return places.map(({ serie, ...c }) => ({
			title: c.name,
			slug: c.slug,
			description: c.address || c.description || "No description provided",
			url: `/dashboard/author/series/${serie.slug}/places/${c.slug}`,
		}));
	}

	private static async searchArticles(
		query: string,
		authorId: string,
	): Promise<AuthorSearchResourceOutputType["items"]> {
		const articles = await prisma.article.findMany({
			where: {
				AND: [
					{
						OR: [
							{ book: { authorId, status: { not: "deleted" } } },
							{ chapter: { authorId, status: { not: "deleted" } } },
							{
								character: { serie: { authorId, status: { not: "deleted" } } },
							},
							{ place: { serie: { authorId, status: { not: "deleted" } } } },
						],
					},
					{
						OR: [
							{ title: { contains: query, mode: "insensitive" } },
							{ slug: { contains: query, mode: "insensitive" } },
							{ description: { contains: query, mode: "insensitive" } },
						],
					},
				],
			},
			take: 5,
			select: {
				slug: true,
				title: true,
				description: true,
				serie: { select: { slug: true } },
			},
		});

		return articles.map(({ serie, ...a }) => ({
			...a,
			url: `/dashboard/author/series/${serie.slug}/articles/${a.slug}`,
		}));
	}

	////
	// QUERIES
	////

	static async authorSearchResource(
		input: AuthorSearchResourceInputType,
		authorId: string,
	): Promise<AuthorSearchResourceOutputType> {
		const { query, type = "serie" } = input;

		if (!query || !query.trim()) {
			return {
				type: "serie",
				items: [],
			};
		}

		const searchTerm = `%${query}%`;

		switch (type) {
			case "serie":
				return {
					type: "serie",
					items: await ResourcesService.searchSeries(searchTerm, authorId),
				};
			case "book":
				return {
					type: "book",
					items: await ResourcesService.searchBooks(searchTerm, authorId),
				};
			case "chapter":
				return {
					type: "chapter",
					items: await ResourcesService.searchChapters(searchTerm, authorId),
				};
			case "character":
				return {
					type: "character",
					items: await ResourcesService.searchCharacters(searchTerm, authorId),
				};
			case "place":
				return {
					type: "place",
					items: await ResourcesService.searchPlaces(searchTerm, authorId),
				};
			case "article":
				return {
					type: "article",
					items: await ResourcesService.searchArticles(searchTerm, authorId),
				};
			default:
				throw new ORPCError("BAD_REQUEST", {
					message: "Invalid type",
				});
		}
	}
}

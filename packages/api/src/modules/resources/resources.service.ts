import prisma from "@encre/db";
import {
	type AuthorSearchResourceInputType,
	type AuthorSearchResourceOutputType,
	SearchableResourceSchema,
	type SearchableResourceType,
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
		return prisma.serie.findMany({
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
	}

	private static async searchBooks(
		query: string,
		authorId: string,
	): Promise<AuthorSearchResourceOutputType["items"]> {
		return prisma.book.findMany({
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
	}

	private static async searchChapters(
		query: string,
		authorId: string,
	): Promise<AuthorSearchResourceOutputType["items"]> {
		return prisma.chapter.findMany({
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
			},
		});

		return characters.map((c) => ({
			title:
				c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : c.name,
			slug: c.slug,
			description: c.description,
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
			select: { slug: true, name: true, address: true, description: true },
		});

		return places.map((c) => ({
			title: c.name,
			slug: c.slug,
			description: c.address || c.description || "No description provided",
		}));
	}

	private static async searchArticles(
		query: string,
		authorId: string,
	): Promise<AuthorSearchResourceOutputType["items"]> {
		return prisma.article.findMany({
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
			select: { slug: true, title: true, description: true },
		});
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

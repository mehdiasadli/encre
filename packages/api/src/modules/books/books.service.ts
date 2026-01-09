import type { Prisma } from "@encre/db";
import prisma from "@encre/db";
import { env } from "@encre/env/server";
import type {
	AuthorGetBookInputType,
	AuthorGetBookOutputType,
	AuthorGetBooksListInputType,
	AuthorGetBooksListOutputType,
	CreateBookInputType,
	CreateBookOutputType,
	DeleteBookInputType,
	DeleteBookOutputType,
	SwapBookOrderInputType,
	SwapBookOrderOutputType,
	UpdateBookInputType,
	UpdateBookOutputType,
} from "@encre/schemas";
import type { ResourceStatusType } from "@encre/schemas/models/inputTypeSchemas/ResourceStatusSchema";
import { generateUniqueSlug, resourceTitleBlocklist } from "@encre/utils";
import { ORPCError } from "@orpc/client";

export class BooksService {
	////
	// HELPERS
	////
	static validateBookTitle(title: string) {
		if (
			resourceTitleBlocklist.some((word) =>
				title.toLowerCase().includes(word.toLowerCase()),
			)
		) {
			throw new ORPCError("BAD_REQUEST", {
				message:
					"Book title contains blocked words. Please choose a different title.",
				data: {
					path: ["title"],
				},
			});
		}
	}

	static async checkBookLimit(serieId: string) {
		const currentBookCount = await prisma.book.count({
			where: { serieId, status: { not: "deleted" } },
		});

		if (currentBookCount > env.MAX_BOOKS_PER_SERIE) {
			throw new ORPCError("BAD_REQUEST", {
				message: `You have reached the maximum number of books (${env.MAX_BOOKS_PER_SERIE} per serie). You cannot add more books.`,
			});
		}
	}

	static async handleTitleChange(
		book: { id: string; title: string | undefined },
		newTitle: string | undefined,
	) {
		if (!newTitle || book.title === newTitle) return undefined;

		BooksService.validateBookTitle(newTitle);

		const updatedSlug = await generateUniqueSlug(newTitle, async (slug) => {
			const existingBook = await prisma.book.findUnique({
				where: { slug },
				select: { id: true, status: true, slug: true },
			});

			if (!existingBook) return null;
			if (existingBook.status === "deleted") {
				await prisma.book.update({
					where: { id: existingBook.id },
					data: {
						slug: `${slug}-deleted-${Math.random().toString(36).slice(4, 8)}`,
					},
				});

				return null;
			}

			return existingBook;
		});

		return updatedSlug;
	}

	static async handleStatusChange(
		book: { id: string; status: ResourceStatusType },
		newStatus: ResourceStatusType | undefined,
	) {
		if (!newStatus || book.status === newStatus) return undefined;

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
			// check if book has chapters
			const [publishedChapterCount] = await prisma.$transaction([
				prisma.chapter.count({
					where: { bookId: book.id, status: "published" },
				}),
			]);

			if (publishedChapterCount === 0) {
				throw new ORPCError("BAD_REQUEST", {
					message:
						"Book cannot be published because it has no published chapters. Please publish at least one chapter before publishing this book.",
				});
			}
		}
	}

	////
	// QUERIES
	////
	static async authorGetBooksList(
		input: AuthorGetBooksListInputType,
		authorId: string,
	): Promise<AuthorGetBooksListOutputType> {
		const { series, statuses, dir, field, mode, query } = input;

		const where: Prisma.BookWhereInput = {
			authorId,
			status: { not: "deleted", ...(statuses && { in: statuses }) },
			...(series && series.length > 0 && { serie: { slug: { in: series } } }),
		};

		if (query) {
			where.OR = [
				{ title: { contains: query, mode } },
				{ slug: { contains: query, mode } },
				{ description: { contains: query, mode } },
			];
		}

		const orderBy = { [field]: dir };

		return await prisma.book.findMany({
			where,
			orderBy,
			select: {
				title: true,
				slug: true,
				status: true,
				description: true,
				createdAt: true,
				updatedAt: true,
				order: true,
				_count: {
					select: {
						chapters: {
							where: { status: { not: "deleted" } },
						},
						likes: true,
						reads: true,
						shelves: true,
					},
				},
			},
		});
	}

	static async authorGetBook(
		input: AuthorGetBookInputType,
		authorId: string,
	): Promise<AuthorGetBookOutputType> {
		const book = await prisma.book.findUnique({
			where: {
				authorId,
				status: { not: "deleted" },
				slug: input.slug,
			},
			omit: {
				authorId: true,
				serieId: true,
				deletedAt: true,
				deletionReason: true,
				id: true,
			},
			include: {
				_count: {
					select: {
						chapters: true,
						likes: true,
						reads: true,
						shelves: true,
					},
				},
			},
		});

		if (!book) {
			throw new ORPCError("NOT_FOUND", {
				message: "Book not found",
			});
		}

		return {
			...book,
			status: book.status as Exclude<ResourceStatusType, "deleted">,
		};
	}

	////
	// MUTATIONS
	////
	static async createBook(
		input: CreateBookInputType,
		authorId: string,
	): Promise<CreateBookOutputType> {
		await BooksService.checkBookLimit(input.serie);
		BooksService.validateBookTitle(input.title);

		// check if the serie exists
		const serie = await prisma.serie.findUnique({
			where: { slug: input.serie, status: { not: "deleted" }, authorId },
			select: { status: true, id: true },
		});

		if (!serie) {
			throw new ORPCError("NOT_FOUND", {
				message: "Serie not found",
			});
		}

		if (serie.status === "cancelled") {
			throw new ORPCError("BAD_REQUEST", {
				message:
					"Serie is cancelled. You cannot add a book to a cancelled serie.",
			});
		}

		// check if the book already exists
		const existingBook = await prisma.book.findFirst({
			where: {
				title: input.title,
				serieId: serie.id,
			},
		});

		if (existingBook) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Book with the same title already exists in this serie.",
			});
		}

		// generate the order
		const bookCount = await prisma.book.count({
			where: { serieId: serie.id, status: { not: "deleted" } },
		});
		const order = bookCount + 1;

		return await prisma.book.create({
			data: {
				title: input.title,
				slug: await generateUniqueSlug(
					input.title,
					async (slug) => await prisma.book.findUnique({ where: { slug } }),
				),
				description: input.description,
				authorId,
				serieId: serie.id,
				order,
			},
			select: {
				slug: true,
			},
		});
	}

	static async updateBook(
		input: UpdateBookInputType,
		authorId: string,
	): Promise<UpdateBookOutputType> {
		const { title, description, status, slug } = input;

		const book = await prisma.book.findUnique({
			where: {
				slug,
				authorId,
				status: { not: "deleted" },
			},
			select: {
				id: true,
				title: true,
				authorId: true,
				slug: true,
				serie: { select: { status: true } },
				status: true,
			},
		});

		if (!book) {
			throw new ORPCError("NOT_FOUND", {
				message: "Book not found",
			});
		}

		if (book.serie.status === "cancelled") {
			throw new ORPCError("BAD_REQUEST", {
				message:
					"Serie is cancelled. You cannot update a book in a cancelled serie.",
			});
		}

		if (book.status === "cancelled") {
			throw new ORPCError("BAD_REQUEST", {
				message: "Book is cancelled. You cannot update a cancelled book.",
			});
		}

		const updatedSlug = await BooksService.handleTitleChange(book, title);
		await BooksService.handleStatusChange(book, status);

		return await prisma.book.update({
			where: { slug },
			data: {
				title: title ?? undefined,
				description: description ?? undefined,
				status: status ?? undefined,
				slug: updatedSlug,
			},
			select: {
				slug: true,
			},
		});
	}

	static async swapBookOrder(
		input: SwapBookOrderInputType,
		authorId: string,
	): Promise<SwapBookOrderOutputType> {
		const findUniqueInput = (slug: string): Prisma.BookFindUniqueArgs => ({
			where: { slug, authorId, status: { not: "deleted" } },
			select: { id: true, serieId: true, order: true, slug: true },
		});

		const [book1, book2] = await prisma.$transaction([
			prisma.book.findUnique(findUniqueInput(input.book1)),
			prisma.book.findUnique(findUniqueInput(input.book2)),
		]);

		if (!book1 || !book2) {
			throw new ORPCError("NOT_FOUND", {
				message: "One of the books (or both) not found",
			});
		}

		if (book1.serieId !== book2.serieId) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Books are not in the same serie",
			});
		}

		await prisma.$transaction(async (tx) => {
			await tx.book.update({
				where: { id: book1.id },
				data: { order: -1000 /** temporary order to avoid conflicts */ },
			});

			await tx.book.update({
				where: { id: book2.id },
				data: { order: book1.order },
			});

			await tx.book.update({
				where: { id: book1.id },
				data: { order: book2.order },
			});
		});

		return {
			book1: book1.slug,
			book2: book2.slug,
		};
	}

	static async deleteBook(
		input: DeleteBookInputType,
		authorId: string,
	): Promise<DeleteBookOutputType> {
		const book = await prisma.book.findUnique({
			where: { slug: input.slug, authorId, status: { not: "deleted" } },
			select: { id: true, slug: true, title: true, serieId: true, order: true },
		});

		if (!book) {
			throw new ORPCError("NOT_FOUND", {
				message: "Book not found",
			});
		}

		if (book.title !== input.title) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Book title does not match",
			});
		}

		await prisma.$transaction(async (tx) => {
			const data = {
				status: "deleted",
				deletionReason: "book",
				deletedAt: new Date(),
			} as const;

			const currentOrder = book.order;

			const lastDeletedBook = await tx.book.findFirst({
				where: { serieId: book.serieId, status: "deleted" },
				orderBy: { deletedAt: "desc" },
			});

			await tx.book.update({
				where: { id: book.id, status: { not: "deleted" } },
				data: {
					...data,
					order: lastDeletedBook ? lastDeletedBook.order - 1 : -1,
				},
			});

			// delete all the chapters
			await tx.chapter.updateMany({
				where: { bookId: book.id, status: { not: "deleted" } },
				data,
			});

			// fix the order of the books
			// books before deleted book remains the same
			// books after deleted book decremented by 1
			await tx.book.updateMany({
				where: {
					serieId: book.serieId,
					status: { not: "deleted" },
					order: { gt: currentOrder },
				},
				data: { order: { decrement: 1 } },
			});
		});

		return {
			slug: book.slug,
		};
	}
}

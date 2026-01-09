/** biome-ignore-all lint/complexity/noStaticOnlyClass: this is a service class */
import prisma, { type Prisma } from "@encre/db";
import { env } from "@encre/env/server";
import type {
	AuthorGetChapterInputType,
	AuthorGetChapterOutputType,
	AuthorGetChaptersListInputType,
	AuthorGetChaptersListOutputType,
	CreateChapterInputType,
	CreateChapterOutputType,
	DeleteChapterInputType,
	DeleteChapterOutputType,
	SwapChapterOrderInputType,
	SwapChapterOrderOutputType,
	UpdateChapterInputType,
	UpdateChapterOutputType,
} from "@encre/schemas";
import type { ResourceStatusType } from "@encre/schemas/models/inputTypeSchemas/ResourceStatusSchema";
import { generateUniqueSlug, resourceTitleBlocklist } from "@encre/utils";
import { ORPCError } from "@orpc/client";

export class ChaptersService {
	////
	// HELPERS
	////
	static validateChapterTitle(title: string) {
		if (
			resourceTitleBlocklist.some((word) =>
				title.toLowerCase().includes(word.toLowerCase()),
			)
		) {
			throw new ORPCError("BAD_REQUEST", {
				message:
					"Chapter title contains blocked words. Please choose a different title.",
				data: {
					path: ["title"],
				},
			});
		}
	}

	static async checkChapterLimit(bookId: string) {
		const currentBookCount = await prisma.chapter.count({
			where: { bookId, status: { not: "deleted" } },
		});

		if (currentBookCount > env.MAX_CHAPTERS_PER_BOOK) {
			throw new ORPCError("BAD_REQUEST", {
				message: `You have reached the maximum number of chapters (${env.MAX_CHAPTERS_PER_BOOK} per book). You cannot add more chapters.`,
			});
		}
	}

	static async handleStatusChange(
		chapter: { id: string; status: ResourceStatusType },
		newStatus: ResourceStatusType | undefined,
	) {
		if (!newStatus || chapter.status === newStatus) return undefined;

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
	}

	static async handleTitleChange(
		chapter: { id: string; title: string | undefined },
		newTitle: string | undefined,
	) {
		if (!newTitle || chapter.title === newTitle) return undefined;

		ChaptersService.validateChapterTitle(newTitle);

		const updatedSlug = await generateUniqueSlug(newTitle, async (slug) => {
			const existingChapter = await prisma.chapter.findUnique({
				where: { slug },
				select: { id: true, status: true, slug: true },
			});

			if (!existingChapter) return null;
			if (existingChapter.status === "deleted") {
				await prisma.chapter.update({
					where: { id: existingChapter.id },
					data: {
						slug: `${slug}-deleted-${Math.random().toString(36).slice(4, 8)}`,
					},
				});

				return null;
			}

			return existingChapter;
		});

		return updatedSlug;
	}

	////
	// QUERIES
	////
	static async authorGetChaptersList(
		input: AuthorGetChaptersListInputType,
		authorId: string,
	): Promise<AuthorGetChaptersListOutputType> {
		const { statuses, books, dir, field, mode, query } = input;

		const where: Prisma.ChapterWhereInput = {
			authorId,
			status: { not: "deleted", ...(statuses && { in: statuses }) },
			...(books && books.length > 0 && { book: { slug: { in: books } } }),
		};

		if (query) {
			where.OR = [
				{ title: { contains: query, mode } },
				{ slug: { contains: query, mode } },
				{ description: { contains: query, mode } },
			];
		}

		const orderBy = { [field]: dir };

		return await prisma.chapter.findMany({
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
				views: true,
				_count: {
					select: {
						reads: true,
						likes: true,
					},
				},
			},
		});
	}

	static async authorGetChapter(
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

	////
	// MUTATIONS
	////
	static async createChapter(
		input: CreateChapterInputType,
		authorId: string,
	): Promise<CreateChapterOutputType> {
		const book = await prisma.book.findUnique({
			where: { authorId, slug: input.book, status: { not: "deleted" } },
			select: {
				status: true,
				id: true,
				serie: { select: { status: true, id: true } },
			},
		});

		if (!book) {
			throw new ORPCError("NOT_FOUND", {
				message: "Book not found",
			});
		}

		if (book.status === "cancelled") {
			throw new ORPCError("BAD_REQUEST", {
				message:
					"Book is cancelled. You cannot add a chapter to a cancelled book.",
			});
		}

		if (book.serie.status === "cancelled") {
			throw new ORPCError("BAD_REQUEST", {
				message:
					"Serie is cancelled. You cannot add a chapter to a cancelled serie.",
			});
		}

		await ChaptersService.checkChapterLimit(book.id);
		ChaptersService.validateChapterTitle(input.title);

		const existingChapter = await prisma.chapter.findFirst({
			where: {
				title: input.title,
				bookId: book.id,
			},
		});

		if (existingChapter) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Chapter with the same title already exists in this book.",
				data: { path: "title" },
			});
		}

		// generate the order
		const chapterCount = await prisma.chapter.count({
			where: { bookId: book.id, status: { not: "deleted" } },
		});
		const order = chapterCount + 1;

		return await prisma.chapter.create({
			data: {
				title: input.title,
				description: input.description,
				authorId,
				serieId: book.serie.id,
				bookId: book.id,
				order,
				content: "",
				slug: await generateUniqueSlug(
					input.title,
					async (slug) => await prisma.chapter.findUnique({ where: { slug } }),
				),
			},
			select: {
				slug: true,
			},
		});
	}

	static async deleteChapter(
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

	static async updateChapter(
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

		const updatedSlug = await ChaptersService.handleTitleChange(
			chapter,
			input.title,
		);
		await ChaptersService.handleStatusChange(chapter, input.status);

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

	static async swapChapterOrder(
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
}

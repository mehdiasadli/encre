import prisma, { type Prisma } from "@encre/db";
import type {
	AuthorGetChaptersListInputType,
	AuthorGetChaptersListOutputType,
} from "@encre/schemas";

export async function authorGetManyChapters(
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

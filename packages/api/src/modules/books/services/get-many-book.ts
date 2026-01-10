import prisma, { type Prisma } from "@encre/db";
import type {
	AuthorGetBooksListInputType,
	AuthorGetBooksListOutputType,
} from "@encre/schemas";

export async function authorGetManyBooks(
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

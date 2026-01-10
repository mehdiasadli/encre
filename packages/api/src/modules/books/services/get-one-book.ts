import prisma from "@encre/db";
import type {
	AuthorGetBookInputType,
	AuthorGetBookOutputType,
} from "@encre/schemas";
import type { ResourceStatusType } from "@encre/schemas/models/inputTypeSchemas/ResourceStatusSchema";
import { ORPCError } from "@orpc/client";

export async function authorGetOneBook(
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

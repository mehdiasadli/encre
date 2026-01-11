import prisma from "@encre/db";
import type {
	AuthorGetOneSerieInputType,
	AuthorGetOneSerieOutputType,
} from "@encre/schemas";
import { ORPCError } from "@orpc/client";

export async function authorGetOneSerie(
	input: AuthorGetOneSerieInputType,
	authorId: string,
): Promise<AuthorGetOneSerieOutputType> {
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
			_count: {
				select: {
					books: { where: { status: { not: "deleted" } } },
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

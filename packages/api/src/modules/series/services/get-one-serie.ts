import prisma from "@encre/db";
import type { GetSerieInputType, GetSerieOutputType } from "@encre/schemas";
import { ORPCError } from "@orpc/client";

export async function authorGetSerie(
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

import prisma from "@encre/db";
import type { AuthorGetManySerieOutputType } from "@encre/schemas";

export async function authorGetManySerie(
	authorId: string,
): Promise<AuthorGetManySerieOutputType> {
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

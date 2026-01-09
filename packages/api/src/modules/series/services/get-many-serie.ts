import prisma from "@encre/db";
import type { AuthorGetSeriesListOutputType } from "@encre/schemas";

export async function authorGetSeriesList(
	authorId: string,
): Promise<AuthorGetSeriesListOutputType> {
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

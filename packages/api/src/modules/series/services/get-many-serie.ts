import prisma, { type Prisma } from "@encre/db";
import type {
	AuthorGetSeriesListOutputType,
	GetSeriesListOutputType,
} from "@encre/schemas";

export async function getSeriesList(
	userId?: string,
): Promise<GetSeriesListOutputType> {
	const where: Prisma.SerieWhereInput = {
		status: "published",
	};

	where.visibility = !userId ? "public" : { in: ["public", "members"] };

	const series = await prisma.serie.findMany({
		where,
		orderBy: { updatedAt: "desc" },
		select: {
			title: true,
			slug: true,
			visibility: true,

			author: {
				select: {
					name: true,
					slug: true,
					image: true,
				},
			},
		},
	});

	return series;
}

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

export async function adminGetSeriesList() {}

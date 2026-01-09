import prisma, { type Prisma } from "@encre/db";
import type {
	AdminGetSeriesListInputType,
	AdminGetSeriesListOutputType,
	AuthorGetSeriesListOutputType,
	GetSeriesListOutputType,
} from "@encre/schemas";
import { paginate } from "@encre/utils";

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

export async function adminGetSeriesList(
	input: AdminGetSeriesListInputType,
): Promise<AdminGetSeriesListOutputType> {
	const where: Prisma.SerieWhereInput = {};

	if (input.authors && input.authors.length > 0) {
		where.author = {
			slug: { in: input.authors },
		};
	}

	if (input.statuses && input.statuses.length > 0) {
		where.status = { in: input.statuses };
	}

	if (input.visibilities && input.visibilities.length > 0) {
		where.visibility = { in: input.visibilities };
	}

	const pagination = paginate.input(input);
	const orderBy = { [input.field]: input.dir };

	const [items, count] = await prisma.$transaction([
		prisma.serie.findMany({
			where,
			orderBy,
			...pagination,
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
		}),
		prisma.serie.count({
			where,
		}),
	]);

	return paginate.output(items, count, input);
}

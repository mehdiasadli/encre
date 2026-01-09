import prisma, { type Prisma } from "@encre/db";
import type {
	AdminGetSerieOutputType,
	AuthorGetSerieOutputType,
	GetSerieInputType,
	GetSerieOutputType,
} from "@encre/schemas";
import { ORPCError } from "@orpc/client";

export async function authorGetSerie(
	input: GetSerieInputType,
	authorId: string,
): Promise<AuthorGetSerieOutputType> {
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

export async function getSerie(
	input: GetSerieInputType,
	userId?: string,
): Promise<GetSerieOutputType> {
	const where: Prisma.SerieWhereInput = {
		slug: input.slug,
		status: "published",
	};

	where.visibility = !userId ? "public" : { in: ["public", "members"] };

	const serie = await prisma.serie.findFirst({
		where,
		omit: {
			authorId: true,
			deletedAt: true,
			deletionReason: true,
			status: true,
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
					books: { where: { status: "published" } },
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

export async function adminGetSerie(
	input: GetSerieInputType,
): Promise<AdminGetSerieOutputType> {
	const serie = await prisma.serie.findFirst({
		where: {
			slug: input.slug,
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
					books: { where: { status: "published" } },
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

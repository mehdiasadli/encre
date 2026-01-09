import prisma, { type Prisma } from "@encre/db";
import type {
	GetLikesOfResourceInputType,
	GetLikesOfResourceOutputType,
	GetLikesOfUserInputType,
	GetLikesOfUserOutputType,
	LikeInputType,
	LikeOutputType,
} from "@encre/schemas";
import type { LikeResourceType } from "@encre/schemas/models/inputTypeSchemas/LikeResourceSchema";
import { paginate } from "@encre/utils";
import { ORPCError } from "@orpc/client";

export class LikesService {
	static async getLikesOfResource(
		input: GetLikesOfResourceInputType,
	): Promise<GetLikesOfResourceOutputType> {
		const { pagination, range, search, sorting, slug, type } = input;

		const where: Prisma.LikeWhereInput = {
			resource: type,
			[type]: { slug },
		};

		if (range.gte || range.lte) {
			where.createdAt = range;
		}

		if (search.query) {
			where.OR = [
				{ user: { username: { contains: search.query, mode: search.mode } } },
				{ user: { name: { contains: search.query, mode: search.mode } } },
			];
		}

		const [items, totalItems] = await prisma.$transaction([
			prisma.like.findMany({
				where,
				...paginate.input(pagination),
				orderBy: sorting,
				select: {
					createdAt: true,
					user: {
						select: {
							name: true,
							username: true,
							image: true,
						},
					},
				},
			}),
			prisma.like.count({
				where,
			}),
		]);

		return paginate.output(items, totalItems, pagination);
	}

	static async getLikesOfUser(
		input: GetLikesOfUserInputType,
	): Promise<GetLikesOfUserOutputType> {
		const { pagination, range, search, sorting, username } = input;

		const where: Prisma.LikeWhereInput = {
			user: { username },
		};

		if (range.gte || range.lte) {
			where.createdAt = range;
		}

		if (search.query) {
			where.OR = [
				{ post: { slug: { contains: search.query, mode: search.mode } } },
				{ serie: { slug: { contains: search.query, mode: search.mode } } },
				{ book: { slug: { contains: search.query, mode: search.mode } } },
				{ chapter: { slug: { contains: search.query, mode: search.mode } } },
				{ character: { slug: { contains: search.query, mode: search.mode } } },
				{ place: { slug: { contains: search.query, mode: search.mode } } },
				{ author: { slug: { contains: search.query, mode: search.mode } } },
				{ article: { slug: { contains: search.query, mode: search.mode } } },
				{ comment: { slug: { contains: search.query, mode: search.mode } } },
			];
		}

		const [items, totalItems] = await prisma.$transaction([
			prisma.like.findMany({
				where,
				...paginate.input(pagination),
				orderBy: sorting,
				select: {
					createdAt: true,
					resource: true,
					post: { select: { slug: true, content: true, image: true } },
					serie: { select: { slug: true, title: true, image: true } },
					book: { select: { slug: true, title: true, image: true } },
					chapter: { select: { slug: true, title: true, image: true } },
					character: { select: { slug: true, name: true, image: true } },
					place: { select: { slug: true, name: true, image: true } },
					author: { select: { slug: true, name: true, image: true } },
					article: { select: { slug: true, title: true, image: true } },
					comment: { select: { slug: true, content: true } },
				},
			}),
			prisma.like.count({
				where,
			}),
		]);

		const getResource = (
			type: LikeResourceType,
			resource: {
				post: {
					slug: string;
					content: string | null;
					image: string | null;
				} | null;
				serie: { slug: string; title: string; image: string | null } | null;
				book: { slug: string; title: string; image: string | null } | null;
				chapter: { slug: string; title: string; image: string | null } | null;
				character: { slug: string; name: string; image: string | null } | null;
				place: { slug: string; name: string; image: string | null } | null;
				author: { slug: string; name: string; image: string | null } | null;
				article: { slug: string; title: string; image: string | null } | null;
				comment: { slug: string; content: string | null } | null;
			},
		) => {
			for (const [key, value] of Object.entries(resource)) {
				if (value !== null) {
					const title =
						key === "post" || key === "comment"
							? ((value as { content: string | null }).content?.slice(0, 100) ??
								"No title")
							: ((value as { title: string }).title ??
								(value as { name: string }).name ??
								"No title");

					const image =
						key === "comment"
							? null
							: (value as { image: string | null }).image;

					return {
						type,
						slug: value.slug,
						title,
						image,
					};
				}
			}

			throw new ORPCError("NOT_FOUND", {
				message: "Resource not found",
			});
		};

		return paginate.output(
			items.map((item) => {
				return {
					createdAt: item.createdAt,
					resource: getResource(item.resource, {
						post: item.post,
						serie: item.serie,
						book: item.book,
						chapter: item.chapter,
						character: item.character,
						place: item.place,
						author: item.author,
						article: item.article,
						comment: item.comment,
					}),
				};
			}),
			totalItems,
			pagination,
		);
	}

	static async likeResource(
		input: LikeInputType,
		userId: string,
	): Promise<LikeOutputType> {
		const { type, slug } = input;

		const like = await prisma.like.findFirst({
			where: {
				userId,
				resource: type,
				[type]: { slug },
			},
		});

		if (!like) {
			// like resource
			await prisma.like.create({
				data: {
					resource: type,
					userId,
					[type]: { slug },
				},
			});

			return {
				action: "liked",
				type,
				slug,
			};
		}

		// unlike resource
		await prisma.like.delete({
			where: {
				id: like.id,
			},
		});

		return {
			action: "unliked",
			type,
			slug,
		};
	}
}

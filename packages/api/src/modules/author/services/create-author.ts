import prisma from "@encre/db";
import type {
	CreateAuthorInputType,
	CreateAuthorOutputType,
} from "@encre/schemas";
import { generateUniqueSlug } from "@encre/utils";
import { ORPCError } from "@orpc/client";

export async function createAuthor(
	input: CreateAuthorInputType,
	userId: string,
): Promise<CreateAuthorOutputType> {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			name: true,
			username: true,
			isAuthor: true,
		},
	});

	if (!user) {
		throw new ORPCError("NOT_FOUND", {
			message: "User not found",
		});
	}

	if (user.isAuthor) {
		throw new ORPCError("BAD_REQUEST", {
			message: "You already have an author profile",
		});
	}

	const slug = await generateUniqueSlug(
		input.slug || user.username,
		async (slug) =>
			await prisma.author.findUnique({
				where: { slug },
			}),
	);

	return await prisma.$transaction(async (tx) => {
		const author = await tx.author.create({
			data: {
				userId,
				slug,
				name: input.name || user.name,
				website: input.website,
				bio: input.bio,
			},
			select: {
				id: true,
				slug: true,
			},
		});

		await tx.user.update({
			where: { id: userId },
			data: {
				authorId: author.id,
				isAuthor: true,
			},
		});

		return { slug: author.slug };
	});
}

import prisma from "@encre/db";
import type { GetMyAuthorOutputType } from "@encre/schemas";

export async function getMyAuthor(
	userId: string,
): Promise<GetMyAuthorOutputType> {
	const author = await prisma.author.findUnique({
		where: {
			userId,
		},
		select: {
			name: true,
			slug: true,
			bio: true,
			image: true,
			website: true,
		},
	});

	return author ?? null;
}

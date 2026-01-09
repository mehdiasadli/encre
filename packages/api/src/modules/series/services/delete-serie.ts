import prisma from "@encre/db";
import type {
	DeleteSerieInputType,
	DeleteSerieOutputType,
} from "@encre/schemas";
import { ORPCError } from "@orpc/client";

export async function deleteSerie(
	input: DeleteSerieInputType,
	authorId: string,
): Promise<DeleteSerieOutputType> {
	const serie = await prisma.serie.findUnique({
		where: { slug: input.slug, authorId, status: { not: "deleted" } },
		select: { authorId: true, slug: true, id: true, title: true },
	});

	if (!serie) {
		throw new ORPCError("NOT_FOUND", {
			message: "Serie not found",
		});
	}

	if (serie.title !== input.title) {
		throw new ORPCError("BAD_REQUEST", {
			message: "Serie title does not match",
		});
	}

	await prisma.$transaction(async (tx) => {
		const data = {
			status: "deleted",
			deletionReason: "serie",
			deletedAt: new Date(),
		} as const;

		await tx.serie.update({
			where: { id: serie.id },
			data,
		});

		// delete all the books
		await tx.book.updateMany({
			where: { serieId: serie.id, status: { not: "deleted" } },
			data,
		});

		// delete all the chapters
		await tx.chapter.updateMany({
			where: { book: { serieId: serie.id, status: { not: "deleted" } } },
			data,
		});

		// delete all the characters
		await tx.character.updateMany({
			where: { serieId: serie.id, status: { not: "deleted" } },
			data,
		});
	});

	return {
		slug: serie.slug,
	};
}

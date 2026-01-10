import prisma from "@encre/db";
import type { CreateBookInputType, CreateBookOutputType } from "@encre/schemas";
import { generateUniqueSlug } from "@encre/utils";
import { ORPCError } from "@orpc/client";
import { validateResourceTitle } from "../../shared.service";
import { checkBookLimit } from "../books.helpers";

export async function createBook(
	input: CreateBookInputType,
	authorId: string,
): Promise<CreateBookOutputType> {
	await checkBookLimit(authorId);
	validateResourceTitle(input.title);

	const serie = await prisma.serie.findUnique({
		where: { slug: input.serie, status: { not: "deleted" }, authorId },
		select: { status: true, id: true },
	});

	if (!serie) {
		throw new ORPCError("NOT_FOUND", {
			message: "Serie not found",
		});
	}

	if (serie.status === "cancelled") {
		throw new ORPCError("BAD_REQUEST", {
			message:
				"Serie is cancelled. You cannot add a book to a cancelled serie.",
		});
	}

	const existingBook = await prisma.book.findFirst({
		where: {
			title: input.title,
			serieId: serie.id,
		},
	});

	if (existingBook) {
		throw new ORPCError("BAD_REQUEST", {
			message: "Book with the same title already exists in this serie.",
		});
	}

	const bookCount = await prisma.book.count({
		where: { serieId: serie.id, status: { not: "deleted" } },
	});
	const order = bookCount + 1;

	return await prisma.book.create({
		data: {
			title: input.title,
			slug: await generateUniqueSlug(
				input.title,
				async (slug) => await prisma.book.findUnique({ where: { slug } }),
			),
			description: input.description,
			authorId,
			serieId: serie.id,
			order,
		},
		select: {
			slug: true,
		},
	});
}

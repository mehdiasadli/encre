import prisma from "@encre/db";
import type {
	CreateSerieInputType,
	CreateSerieOutputType,
} from "@encre/schemas";
import { generateUniqueSlug } from "@encre/utils";
import { ORPCError } from "@orpc/client";
import { validateResourceTitle } from "../../shared.service";
import { checkSerieLimit } from "../series.helpers";

export async function createSerie(
	input: CreateSerieInputType,
	authorId: string,
): Promise<CreateSerieOutputType> {
	await checkSerieLimit(authorId);
	validateResourceTitle(input.title);

	// check if author has already a serie with the same title
	const existingSerie = await prisma.serie.findFirst({
		where: {
			title: input.title,
			authorId,
			status: { not: "deleted" },
		},
	});

	if (existingSerie) {
		throw new ORPCError("BAD_REQUEST", {
			message: "You already have a serie with the same title",
			data: {
				path: ["title"],
			},
		});
	}

	return await prisma.serie.create({
		data: {
			title: input.title,
			slug: await generateUniqueSlug(
				input.title,
				async (slug) =>
					await prisma.serie.findUnique({
						where: { slug },
					}),
			),
			description: input.description,
			authorId,
		},
		select: {
			slug: true,
		},
	});
}

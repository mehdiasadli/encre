import prisma from "@encre/db";
import type {
	UpdateSerieInputType,
	UpdateSerieOutputType,
} from "@encre/schemas";
import { ORPCError } from "@orpc/client";
import {
	handleSerieStatusChange,
	handleSerieTitleChange,
} from "../series.helpers";

export async function updateSerie(
	input: UpdateSerieInputType,
	authorId: string,
): Promise<UpdateSerieOutputType> {
	const { title, description, status, visibility, slug } = input;

	const serie = await prisma.serie.findUnique({
		where: { slug, authorId, status: { not: "deleted" } },
		select: {
			id: true,
			title: true,
			authorId: true,
			slug: true,
			status: true,
		},
	});

	if (!serie) {
		throw new ORPCError("NOT_FOUND", {
			message: "Serie not found",
		});
	}

	if (serie.status === "cancelled") {
		throw new ORPCError("BAD_REQUEST", {
			message: "Serie is cancelled. You cannot update a cancelled serie.",
		});
	}

	const updatedSlug = await handleSerieTitleChange(serie, title);
	await handleSerieStatusChange(serie, status);

	return await prisma.serie.update({
		where: { slug },
		data: {
			title,
			description: description ?? undefined,
			status: status ?? undefined,
			visibility: visibility ?? undefined,
			slug: updatedSlug,
		},
		select: {
			slug: true,
		},
	});
}

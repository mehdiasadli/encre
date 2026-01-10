import prisma from "@encre/db";
import type {
	CreateCharacterInput,
	CreateCharacterOutput,
} from "@encre/schemas";
import { generateUniqueSlug } from "@encre/utils";
import { ORPCError } from "@orpc/client";

export async function createCharacter(
	input: CreateCharacterInput,
	authorId: string,
): Promise<CreateCharacterOutput> {
	const serie = await prisma.serie.findFirst({
		where: {
			slug: input.serie,
			authorId,
			status: { not: "deleted" },
		},
		select: { id: true, status: true },
	});

	if (!serie) {
		throw new ORPCError("NOT_FOUND", {
			message: "Serie not found",
		});
	}

	if (serie.status === "cancelled") {
		throw new ORPCError("BAD_REQUEST", {
			message:
				"Serie is cancelled. You cannot add a character to a cancelled serie.",
		});
	}

	const { name, slug } = await generateNameAndSlug(
		input.name,
		input.firstName,
		input.middleName,
		input.lastName,
	);

	const { serie: _, name: __, ...data } = input;

	return await prisma.character.create({
		data: {
			...data,
			name,
			slug,
			serieId: serie.id,
		},
	});
}

async function generateNameAndSlug(
	name?: string | null,
	firstName?: string | null,
	middleName?: string | null,
	lastName?: string | null,
) {
	let resultName = "";

	if (name) {
		resultName = name;
	} else if (firstName || lastName || middleName) {
		resultName = [firstName, middleName, lastName].filter(Boolean).join(" ");
	} else {
		const unnamedCharactersCount = await prisma.character.count({
			where: {
				name: {
					startsWith: "Unnamed Character",
				},
				status: { not: "deleted" },
			},
		});

		resultName = `Unnamed Character ${unnamedCharactersCount + 1}`;
	}

	const slug = await generateUniqueSlug(resultName, async (slug) => {
		return await prisma.character.findUnique({
			where: {
				slug,
				status: { not: "deleted" },
			},
		});
	});

	return {
		name: resultName,
		slug,
	};
}

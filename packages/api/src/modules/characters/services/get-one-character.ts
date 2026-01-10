import prisma, { type Prisma } from "@encre/db";
import type { GetCharacterInput, GetCharacterOutput } from "@encre/schemas";
import { ORPCError } from "@orpc/client";

export async function getOneCharacter(
	input: GetCharacterInput,
	userId?: string,
): Promise<GetCharacterOutput> {
	const where: Prisma.CharacterWhereInput = {
		slug: input.slug,
		status: { not: "deleted" },
	};

	where.serie = userId
		? { visibility: { in: ["public", "members"] } }
		: { visibility: "public" };

	const character = await prisma.character.findFirst({
		where,
		select: {
			name: true,
			description: true,
			firstName: true,
			middleName: true,
			lastName: true,
			aliases: true,
			dayOfBirth: true,
			monthOfBirth: true,
			yearOfBirth: true,
			dayOfDeath: true,
			monthOfDeath: true,
			yearOfDeath: true,
			aliveStatus: true,
			gender: true,
			createdAt: true,
			updatedAt: true,
			slug: true,
			serie: {
				select: {
					title: true,
					slug: true,
				},
			},
			_count: {
				select: {
					likes: true,
				},
			},
		},
	});

	if (!character) {
		throw new ORPCError("NOT_FOUND", {
			message: "Character not found",
		});
	}

	return character;
}

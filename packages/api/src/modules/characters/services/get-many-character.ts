import prisma, { type Prisma } from "@encre/db";
import type {
	GetManyCharactersInput,
	GetManyCharactersOutput,
} from "@encre/schemas";

export async function getManyCharacters(
	input: GetManyCharactersInput,
	userId?: string,
): Promise<GetManyCharactersOutput> {
	const where: Prisma.CharacterWhereInput = {
		status: { not: "deleted" },
	};

	where.serie = userId
		? { visibility: { in: ["public", "members"] } }
		: { visibility: "public" };

	if (input.query) {
		where.OR = [
			{ name: { contains: input.query, mode: input.mode } },
			{ firstName: { contains: input.query, mode: input.mode } },
			{ lastName: { contains: input.query, mode: input.mode } },
			{ aliases: { hasSome: [input.query] } },
			{ description: { contains: input.query, mode: input.mode } },
			{ slug: { contains: input.query, mode: input.mode } },
		];
	}

	return await prisma.character.findMany({
		where,
		select: {
			slug: true,
			name: true,
			description: true,
			firstName: true,
			middleName: true,
			lastName: true,
			serie: {
				select: {
					title: true,
				},
			},
			_count: {
				select: {
					likes: true,
				},
			},
		},
	});
}

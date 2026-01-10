import {
	CreateCharacterInputSchema,
	CreateCharacterOutputSchema,
	GetCharacterInputSchema,
	GetCharacterOutputSchema,
	GetManyCharactersInputSchema,
	GetManyCharactersOutputSchema,
} from "@encre/schemas";
import { authorProcedure, publicProcedure } from "../../procedures";
import {
	createCharacter,
	getManyCharacters,
	getOneCharacter,
} from "./services";

export const charactersRouter = {
	createCharacter: authorProcedure
		.input(CreateCharacterInputSchema)
		.output(CreateCharacterOutputSchema)
		.handler(
			async ({ input, context }) =>
				await createCharacter(input, context.author.id),
		),
	getOneCharacter: publicProcedure
		.input(GetCharacterInputSchema)
		.output(GetCharacterOutputSchema)
		.handler(
			async ({ input, context }) =>
				await getOneCharacter(input, context.user?.id),
		),
	getManyCharacters: publicProcedure
		.input(GetManyCharactersInputSchema)
		.output(GetManyCharactersOutputSchema)
		.handler(
			async ({ input, context }) =>
				await getManyCharacters(input, context.user?.id),
		),
};

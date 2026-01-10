import { z } from "zod";
import { CountSchema, SearchSchema } from "../common.schema";
import { CharacterSchema, SerieSchema } from "../models";

// CREATE
export const CreateCharacterInputSchema = CharacterSchema.pick({
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
	// TODO: implement Place and use on creating characters
	// placeOfBirthId: true,
	// placeOfDeathId: true,
	serieId: true,
});
export type CreateCharacterInput = z.infer<typeof CreateCharacterInputSchema>;

export const CreateCharacterOutputSchema = CharacterSchema.pick({
	slug: true,
});
export type CreateCharacterOutput = z.infer<typeof CreateCharacterOutputSchema>;

// READ ONE
export const GetCharacterInputSchema = CharacterSchema.pick({
	slug: true,
});
export type GetCharacterInput = z.infer<typeof GetCharacterInputSchema>;

export const GetCharacterOutputSchema = CharacterSchema.pick({
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
}).extend({
	serie: SerieSchema.pick({
		title: true,
		slug: true,
	}),
	_count: CountSchema(["likes"]),
});
export type GetCharacterOutput = z.infer<typeof GetCharacterOutputSchema>;

// READ MANY
export const GetManyCharactersInputSchema = z
	.object({})
	.extend(SearchSchema.shape);
export type GetManyCharactersInput = z.infer<
	typeof GetManyCharactersInputSchema
>;

export const GetManyCharactersOutputSchema = CharacterSchema.pick({
	slug: true,
	name: true,
	description: true,
	firstName: true,
	middleName: true,
	lastName: true,
}).extend({
	serie: SerieSchema.pick({
		title: true,
	}),
	_count: CountSchema(["likes"]),
});

// UPDATE
export const UpdateCharacterInputSchema = CharacterSchema.pick({
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
	slug: true,
})
	.partial()
	.required({ slug: true });
export type UpdateCharacterInput = z.infer<typeof UpdateCharacterInputSchema>;

export const UpdateCharacterOutputSchema = CharacterSchema.pick({
	slug: true,
});
export type UpdateCharacterOutput = z.infer<typeof UpdateCharacterOutputSchema>;

// DELETE
export const DeleteCharacterInputSchema = CharacterSchema.pick({
	slug: true,
	name: true,
});
export type DeleteCharacterInput = z.infer<typeof DeleteCharacterInputSchema>;

export const DeleteCharacterOutputSchema = CharacterSchema.pick({
	slug: true,
});
export type DeleteCharacterOutput = z.infer<typeof DeleteCharacterOutputSchema>;

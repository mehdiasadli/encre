import type { z } from "zod";
import { CharacterSchema } from "../models";

// CREATE
export const CreateCharacterInputSchema = CharacterSchema.pick({});
export type CreateCharacterInput = z.infer<typeof CreateCharacterInputSchema>;

export const CreateCharacterOutputSchema = CharacterSchema.pick({});
export type CreateCharacterOutput = z.infer<typeof CreateCharacterOutputSchema>;

// READ ONE
export const GetCharacterInputSchema = CharacterSchema.pick({});
export type GetCharacterInput = z.infer<typeof GetCharacterInputSchema>;

export const GetCharacterOutputSchema = CharacterSchema.pick({});
export type GetCharacterOutput = z.infer<typeof GetCharacterOutputSchema>;

// READ MANY
export const GetManyCharactersInputSchema = CharacterSchema.pick({});
export type GetManyCharactersInput = z.infer<
	typeof GetManyCharactersInputSchema
>;

// UPDATE
export const UpdateCharacterInputSchema = CharacterSchema.pick({});
export type UpdateCharacterInput = z.infer<typeof UpdateCharacterInputSchema>;

export const UpdateCharacterOutputSchema = CharacterSchema.pick({});
export type UpdateCharacterOutput = z.infer<typeof UpdateCharacterOutputSchema>;

// DELETE
export const DeleteCharacterInputSchema = CharacterSchema.pick({});
export type DeleteCharacterInput = z.infer<typeof DeleteCharacterInputSchema>;

export const DeleteCharacterOutputSchema = CharacterSchema.pick({});
export type DeleteCharacterOutput = z.infer<typeof DeleteCharacterOutputSchema>;

import { z } from "zod";
import { slugRegex } from "../../regex";
import { AliveStatusSchema } from "../inputTypeSchemas/AliveStatusSchema";
import { DeletionResourceSchema } from "../inputTypeSchemas/DeletionResourceSchema";
import { GenderSchema } from "../inputTypeSchemas/GenderSchema";
import { ResourceStatusSchema } from "../inputTypeSchemas/ResourceStatusSchema";

/////////////////////////////////////////
// CHARACTER SCHEMA
/////////////////////////////////////////

export const CharacterSchema = z.object({
	deletionReason: DeletionResourceSchema.nullish(),
	status: ResourceStatusSchema,
	gender: GenderSchema.nullish(),
	aliveStatus: AliveStatusSchema,
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	slug: z.string().regex(slugRegex, { message: "Invalid slug" }),
	deletedAt: z.coerce.date().nullish(),
	name: z
		.string()
		.min(1, { message: "Name is required" })
		.max(50, { message: "Name cannot exceed 50 characters" }),
	description: z
		.string()
		.max(1000, { message: "Description cannot exceed 1000 characters" })
		.nullish(),
	image: z.url({ message: "Invalid image URL" }).nullish(),
	serieId: z.uuid({ message: "Invalid serie ID" }),
	firstName: z
		.string()
		.max(50, { message: "First name cannot exceed 50 characters" })
		.nullish(),
	middleName: z
		.string()
		.max(50, { message: "Middle name cannot exceed 50 characters" })
		.nullish(),
	lastName: z
		.string()
		.max(50, { message: "Last name cannot exceed 50 characters" })
		.nullish(),
	aliases: z
		.string()
		.min(1, { message: "Alias is required" })
		.max(50, { message: "Alias cannot exceed 50 characters" })
		.array(),
	dayOfBirth: z
		.number()
		.int({ message: "Invalid day of birth" })
		.min(1, { message: "Day of birth must be at least 1" })
		.max(31, { message: "Day of birth cannot exceed 31" })
		.nullish(),
	monthOfBirth: z
		.number()
		.int({ message: "Invalid month of birth" })
		.min(1, { message: "Month of birth must be at least 1" })
		.max(12, { message: "Month of birth cannot exceed 12" })
		.nullish(),
	yearOfBirth: z.number().int({ message: "Invalid year of birth" }).nullish(),
	dayOfDeath: z
		.number()
		.int({ message: "Invalid day of birth" })
		.min(1, { message: "Day of birth must be at least 1" })
		.max(31, { message: "Day of birth cannot exceed 31" })
		.nullish(),
	monthOfDeath: z
		.number()
		.int({ message: "Invalid month of birth" })
		.min(1, { message: "Month of birth must be at least 1" })
		.max(12, { message: "Month of birth cannot exceed 12" })
		.nullish(),
	yearOfDeath: z.number().int({ message: "Invalid year of birth" }).nullish(),
	placeOfBirthId: z.uuid({ message: "Invalid place of birth ID" }).nullish(),
	placeOfDeathId: z.uuid({ message: "Invalid place of death ID" }).nullish(),
});

export type Character = z.infer<typeof CharacterSchema>;

/////////////////////////////////////////
// CHARACTER CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const CharacterCustomValidatorsSchema = CharacterSchema;

export type CharacterCustomValidators = z.infer<
	typeof CharacterCustomValidatorsSchema
>;

export default CharacterSchema;

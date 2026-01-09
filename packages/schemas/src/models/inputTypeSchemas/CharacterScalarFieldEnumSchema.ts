import { z } from "zod";

export const CharacterScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"slug",
	"deletionReason",
	"deletedAt",
	"name",
	"description",
	"image",
	"status",
	"serieId",
	"firstName",
	"middleName",
	"lastName",
	"aliases",
	"gender",
	"dayOfBirth",
	"monthOfBirth",
	"yearOfBirth",
	"dayOfDeath",
	"monthOfDeath",
	"yearOfDeath",
	"aliveStatus",
	"placeOfBirthId",
	"placeOfDeathId",
]);

export default CharacterScalarFieldEnumSchema;

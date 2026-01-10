import { z } from "zod";

export const CharacterRelationScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"type",
	"parentType",
	"partnerType",
	"characterId",
	"relatedCharacterId",
]);

export default CharacterRelationScalarFieldEnumSchema;

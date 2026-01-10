import { z } from "zod";
import { CharacterRelationTypeSchema } from "../inputTypeSchemas/CharacterRelationTypeSchema";
import { ParentTypeSchema } from "../inputTypeSchemas/ParentTypeSchema";
import { PartnerTypeSchema } from "../inputTypeSchemas/PartnerTypeSchema";

/////////////////////////////////////////
// CHARACTER RELATION SCHEMA
/////////////////////////////////////////

export const CharacterRelationSchema = z.object({
	type: CharacterRelationTypeSchema,
	parentType: ParentTypeSchema.nullish(),
	partnerType: PartnerTypeSchema.nullish(),
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	characterId: z.uuid({ message: "Invalid character ID" }),
	relatedCharacterId: z.uuid({ message: "Invalid related character ID" }),
});

export type CharacterRelation = z.infer<typeof CharacterRelationSchema>;

export default CharacterRelationSchema;

import { z } from "zod";

export const CharacterRelationTypeSchema = z.enum(["parent", "partner"]);

export type CharacterRelationTypeType =
	`${z.infer<typeof CharacterRelationTypeSchema>}`;

export default CharacterRelationTypeSchema;

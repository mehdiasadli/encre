import { z } from "zod";
import { ChapterCharacterAppearanceSchema } from "../inputTypeSchemas/ChapterCharacterAppearanceSchema";

/////////////////////////////////////////
// CHAPTER CHARACTER SCHEMA
/////////////////////////////////////////

export const ChapterCharacterSchema = z.object({
	appearance: ChapterCharacterAppearanceSchema,
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	chapterId: z.uuid({ message: "Invalid chapter ID" }),
	characterId: z.uuid({ message: "Invalid character ID" }),
});

export type ChapterCharacter = z.infer<typeof ChapterCharacterSchema>;

export default ChapterCharacterSchema;

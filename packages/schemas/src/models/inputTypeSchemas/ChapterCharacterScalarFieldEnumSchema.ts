import { z } from "zod";

export const ChapterCharacterScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"chapterId",
	"characterId",
	"appearance",
]);

export default ChapterCharacterScalarFieldEnumSchema;

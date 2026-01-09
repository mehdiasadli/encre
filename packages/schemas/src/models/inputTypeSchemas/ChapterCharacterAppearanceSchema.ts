import { z } from "zod";

export const ChapterCharacterAppearanceSchema = z.enum([
	"appeared",
	"mentioned",
	"pov",
]);

export type ChapterCharacterAppearanceType =
	`${z.infer<typeof ChapterCharacterAppearanceSchema>}`;

export default ChapterCharacterAppearanceSchema;

import { z } from "zod";

export const LikeResourceSchema = z.enum([
	"comment",
	"post",
	"serie",
	"book",
	"chapter",
	"character",
	"article",
	"place",
	"author",
]);

export type LikeResourceType = `${z.infer<typeof LikeResourceSchema>}`;

export default LikeResourceSchema;

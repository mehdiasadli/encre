import { z } from "zod";

export const ArticleTypeSchema = z.enum([
	"book",
	"chapter",
	"character",
	"place",
	"other",
]);

export type ArticleTypeType = `${z.infer<typeof ArticleTypeSchema>}`;

export default ArticleTypeSchema;

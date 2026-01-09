import { z } from "zod";

export const ArticleScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"slug",
	"type",
	"title",
	"description",
	"image",
	"content",
	"bookId",
	"chapterId",
	"characterId",
	"placeId",
]);

export default ArticleScalarFieldEnumSchema;

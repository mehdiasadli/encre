import { z } from "zod";

export const ChapterScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"slug",
	"deletionReason",
	"deletedAt",
	"title",
	"description",
	"image",
	"content",
	"publishedAt",
	"lastPublishedAt",
	"editedAt",
	"draft",
	"serieId",
	"bookId",
	"authorId",
	"status",
	"order",
	"views",
	"words",
]);

export default ChapterScalarFieldEnumSchema;

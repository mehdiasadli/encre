import { z } from "zod";

export const ChapterScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"editedAt",
	"slug",
	"deletionReason",
	"deletedAt",
	"title",
	"description",
	"image",
	"content",
	"serieId",
	"bookId",
	"authorId",
	"status",
	"order",
	"views",
]);

export default ChapterScalarFieldEnumSchema;

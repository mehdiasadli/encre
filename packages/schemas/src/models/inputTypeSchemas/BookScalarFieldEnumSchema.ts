import { z } from "zod";

export const BookScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"slug",
	"deletionReason",
	"deletedAt",
	"title",
	"description",
	"image",
	"serieId",
	"authorId",
	"status",
	"order",
]);

export default BookScalarFieldEnumSchema;

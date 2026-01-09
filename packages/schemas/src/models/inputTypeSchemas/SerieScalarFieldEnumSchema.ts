import { z } from "zod";

export const SerieScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"slug",
	"deletionReason",
	"deletedAt",
	"title",
	"description",
	"image",
	"authorId",
	"status",
	"visibility",
]);

export default SerieScalarFieldEnumSchema;

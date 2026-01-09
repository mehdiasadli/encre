import { z } from "zod";

export const ReadScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"slug",
	"userId",
	"bookId",
	"chapterId",
	"rating",
	"review",
]);

export default ReadScalarFieldEnumSchema;

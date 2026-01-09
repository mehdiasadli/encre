import { z } from "zod";

export const LikeScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"resource",
	"userId",
	"postId",
	"serieId",
	"bookId",
	"chapterId",
	"characterId",
	"placeId",
	"authorId",
	"articleId",
	"commentId",
]);

export default LikeScalarFieldEnumSchema;

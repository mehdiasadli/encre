import { z } from "zod";

export const CommentScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"slug",
	"content",
	"userId",
	"type",
	"depth",
	"parentCommentId",
	"postId",
	"serieId",
	"bookId",
	"chapterId",
	"characterId",
	"placeId",
	"authorId",
	"articleId",
]);

export default CommentScalarFieldEnumSchema;

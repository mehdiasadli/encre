import { z } from "zod";

export const PostAttachementScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"postId",
	"type",
	"serieId",
	"bookId",
	"chapterId",
	"characterId",
	"placeId",
	"authorId",
	"attachedPostId",
]);

export default PostAttachementScalarFieldEnumSchema;

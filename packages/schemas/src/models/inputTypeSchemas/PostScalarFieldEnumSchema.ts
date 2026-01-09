import { z } from "zod";

export const PostScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"slug",
	"content",
	"image",
]);

export default PostScalarFieldEnumSchema;

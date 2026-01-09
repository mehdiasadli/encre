import { z } from "zod";

export const AuthorFollowScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"userId",
	"authorId",
]);

export default AuthorFollowScalarFieldEnumSchema;

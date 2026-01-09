import { z } from "zod";

export const AuthorScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"userId",
	"name",
	"slug",
	"bio",
	"image",
	"website",
]);

export default AuthorScalarFieldEnumSchema;

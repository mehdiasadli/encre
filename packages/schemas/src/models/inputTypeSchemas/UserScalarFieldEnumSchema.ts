import { z } from "zod";

export const UserScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"name",
	"email",
	"username",
	"role",
	"emailVerified",
	"image",
]);

export default UserScalarFieldEnumSchema;

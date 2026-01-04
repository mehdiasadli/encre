import { z } from "zod";

export const VerificationScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"expiresAt",
	"identifier",
	"value",
]);

export default VerificationScalarFieldEnumSchema;

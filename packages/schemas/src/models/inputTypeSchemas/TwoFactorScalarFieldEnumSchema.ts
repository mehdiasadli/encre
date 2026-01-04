import { z } from "zod";

export const TwoFactorScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"userId",
	"secret",
	"backupCodes",
]);

export default TwoFactorScalarFieldEnumSchema;

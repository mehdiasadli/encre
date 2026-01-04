import { z } from "zod";

export const SessionScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"expiresAt",
	"token",
	"ipAddress",
	"userAgent",
	"userId",
]);

export default SessionScalarFieldEnumSchema;

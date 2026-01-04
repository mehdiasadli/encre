import { z } from "zod";

export const AccountScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"accountId",
	"providerId",
	"userId",
	"accessToken",
	"refreshToken",
	"idToken",
	"accessTokenExpiresAt",
	"refreshTokenExpiresAt",
	"scope",
	"password",
]);

export default AccountScalarFieldEnumSchema;

import { z } from "zod";

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	accountId: z.string(),
	providerId: z.string(),
	userId: z.string(),
	accessToken: z.string().nullish(),
	refreshToken: z.string().nullish(),
	idToken: z.string().nullish(),
	accessTokenExpiresAt: z.coerce.date().nullish(),
	refreshTokenExpiresAt: z.coerce.date().nullish(),
	scope: z.string().nullish(),
	password: z.string().nullish(),
});

export type Account = z.infer<typeof AccountSchema>;

export default AccountSchema;

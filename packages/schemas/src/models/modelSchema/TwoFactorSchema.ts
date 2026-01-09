import { z } from "zod";

/////////////////////////////////////////
// TWO FACTOR SCHEMA
/////////////////////////////////////////

export const TwoFactorSchema = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	userId: z.string(),
	secret: z.string().nullish(),
	backupCodes: z.string().nullish(),
});

export type TwoFactor = z.infer<typeof TwoFactorSchema>;

export default TwoFactorSchema;

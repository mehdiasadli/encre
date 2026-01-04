import { z } from "zod";

/////////////////////////////////////////
// TWO FACTOR SCHEMA
/////////////////////////////////////////

export const TwoFactorSchema = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	userId: z.string(),
	secret: z.string().nullable(),
	backupCodes: z.string().nullable(),
});

export type TwoFactor = z.infer<typeof TwoFactorSchema>;

export default TwoFactorSchema;

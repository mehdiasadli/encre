import { z } from "zod";

/////////////////////////////////////////
// VERIFICATION SCHEMA
/////////////////////////////////////////

export const VerificationSchema = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	expiresAt: z.coerce.date(),
	identifier: z.string(),
	value: z.string(),
});

export type Verification = z.infer<typeof VerificationSchema>;

export default VerificationSchema;

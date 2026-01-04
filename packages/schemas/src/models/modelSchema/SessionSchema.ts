import { z } from "zod";

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	expiresAt: z.coerce.date(),
	token: z.string(),
	ipAddress: z.string().nullable(),
	userAgent: z.string().nullable(),
	userId: z.uuid({ message: "Invalid user ID" }),
});

export type Session = z.infer<typeof SessionSchema>;

export default SessionSchema;

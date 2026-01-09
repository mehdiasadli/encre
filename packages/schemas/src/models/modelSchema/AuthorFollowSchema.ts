import { z } from "zod";

/////////////////////////////////////////
// AUTHOR FOLLOW SCHEMA
/////////////////////////////////////////

export const AuthorFollowSchema = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	userId: z.uuid({ message: "Invalid user ID" }),
	authorId: z.uuid({ message: "Invalid author ID" }),
});

export type AuthorFollow = z.infer<typeof AuthorFollowSchema>;

export default AuthorFollowSchema;

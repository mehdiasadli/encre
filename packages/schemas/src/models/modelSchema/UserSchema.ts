import { z } from "zod";
import { UserRoleSchema } from "../inputTypeSchemas/UserRoleSchema";

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
	role: UserRoleSchema,
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	name: z.string().min(1, { message: "Name is required" }),
	email: z.email({ message: "Invalid email address" }),
	username: z
		.string()
		.min(4, { message: "Username must be at least 4 characters" })
		.max(20, { message: "Username must be less than 20 characters" }),
	emailVerified: z.boolean(),
	image: z.url({ message: "Invalid image URL" }).nullish(),
	twoFactorEnabled: z.boolean().nullish(),
	isAuthor: z.boolean(),
	authorId: z.string().nullish(),
});

export type User = z.infer<typeof UserSchema>;

export default UserSchema;

import { z } from "zod";

export const UserRoleSchema = z.enum(["user", "moderator", "admin"]);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`;

export default UserRoleSchema;

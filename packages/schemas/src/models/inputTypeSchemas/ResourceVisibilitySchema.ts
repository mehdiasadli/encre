import { z } from "zod";

export const ResourceVisibilitySchema = z.enum([
	"public",
	"private",
	"unlisted",
	"followers",
	"members",
]);

export type ResourceVisibilityType =
	`${z.infer<typeof ResourceVisibilitySchema>}`;

export default ResourceVisibilitySchema;

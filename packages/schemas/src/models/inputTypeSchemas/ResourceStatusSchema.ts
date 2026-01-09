import { z } from "zod";

export const ResourceStatusSchema = z.enum([
	"draft",
	"published",
	"archived",
	"coming_soon",
	"cancelled",
	"deleted",
]);

export type ResourceStatusType = `${z.infer<typeof ResourceStatusSchema>}`;

export default ResourceStatusSchema;

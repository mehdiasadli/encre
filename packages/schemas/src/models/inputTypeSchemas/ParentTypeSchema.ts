import { z } from "zod";

export const ParentTypeSchema = z.enum(["father", "mother", "unknown"]);

export type ParentTypeType = `${z.infer<typeof ParentTypeSchema>}`;

export default ParentTypeSchema;

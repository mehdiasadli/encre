import { z } from "zod";

export const DeletionResourceSchema = z.enum([
	"serie",
	"book",
	"chapter",
	"character",
]);

export type DeletionResourceType = `${z.infer<typeof DeletionResourceSchema>}`;

export default DeletionResourceSchema;

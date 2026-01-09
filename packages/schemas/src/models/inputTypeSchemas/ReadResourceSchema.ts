import { z } from "zod";

export const ReadResourceSchema = z.enum(["book", "chapter"]);

export type ReadResourceType = `${z.infer<typeof ReadResourceSchema>}`;

export default ReadResourceSchema;

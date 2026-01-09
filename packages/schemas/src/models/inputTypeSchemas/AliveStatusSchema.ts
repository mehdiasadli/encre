import { z } from "zod";

export const AliveStatusSchema = z.enum(["alive", "dead", "unknown"]);

export type AliveStatusType = `${z.infer<typeof AliveStatusSchema>}`;

export default AliveStatusSchema;

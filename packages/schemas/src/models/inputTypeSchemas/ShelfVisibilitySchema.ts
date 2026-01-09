import { z } from "zod";

export const ShelfVisibilitySchema = z.enum(["public", "members", "private"]);

export type ShelfVisibilityType = `${z.infer<typeof ShelfVisibilitySchema>}`;

export default ShelfVisibilitySchema;

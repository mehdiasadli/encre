import type { z } from "zod";
import { AuthorSchema } from "../../models";

export const UpdateAuthorInputSchema = AuthorSchema.pick({}).partial();
export type UpdateAuthorInputType = z.infer<typeof UpdateAuthorInputSchema>;

export const UpdateAuthorOutputSchema = AuthorSchema.pick({});
export type UpdateAuthorOutputType = z.infer<typeof UpdateAuthorOutputSchema>;

import type { z } from "zod";
import { AuthorSchema } from "../../models";

export const DeleteAuthorInputSchema = AuthorSchema.pick({});
export type DeleteAuthorInputType = z.infer<typeof DeleteAuthorInputSchema>;

export const DeleteAuthorOutputSchema = AuthorSchema.pick({});
export type DeleteAuthorOutputType = z.infer<typeof DeleteAuthorOutputSchema>;

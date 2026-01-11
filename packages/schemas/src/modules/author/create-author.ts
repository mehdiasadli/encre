import type { z } from "zod";
import { AuthorSchema } from "../../models";

export const CreateAuthorInputSchema = AuthorSchema.pick({
	name: true,
	website: true,
	bio: true,
	slug: true,
});
export type CreateAuthorInputType = z.infer<typeof CreateAuthorInputSchema>;

export const CreateAuthorOutputSchema = AuthorSchema.pick({
	slug: true,
});
export type CreateAuthorOutputType = z.infer<typeof CreateAuthorOutputSchema>;

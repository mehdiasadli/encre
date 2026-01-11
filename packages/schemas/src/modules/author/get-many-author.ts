import { z } from "zod";
import { AuthorSchema } from "../../models";

export const GetManyAuthorInputSchema = AuthorSchema.pick({});
export type GetManyAuthorInputType = z.infer<typeof GetManyAuthorInputSchema>;

export const GetManyAuthorOutputSchema = z.array(AuthorSchema);
export type GetManyAuthorOutputType = z.infer<typeof GetManyAuthorOutputSchema>;

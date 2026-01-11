import type { z } from "zod";
import { SerieSchema } from "../../models";

export const CreateSerieInputSchema = SerieSchema.pick({
	title: true,
	description: true,
});
export type CreateSerieInputType = z.infer<typeof CreateSerieInputSchema>;

export const CreateSerieOutputSchema = SerieSchema.pick({
	slug: true,
});
export type CreateSerieOutputType = z.infer<typeof CreateSerieOutputSchema>;

import type { z } from "zod";
import { SerieSchema } from "../../models";

export const DeleteSerieInputSchema = SerieSchema.pick({
	slug: true,
	title: true,
});
export type DeleteSerieInputType = z.infer<typeof DeleteSerieInputSchema>;

export const DeleteSerieOutputSchema = SerieSchema.pick({
	slug: true,
});
export type DeleteSerieOutputType = z.infer<typeof DeleteSerieOutputSchema>;

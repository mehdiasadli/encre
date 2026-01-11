import type { z } from "zod";
import { SerieSchema } from "../../models";

export const UpdateSerieInputSchema = SerieSchema.pick({
	title: true,
	description: true,
	status: true,
	visibility: true,
	slug: true,
})
	.partial()
	.required({ slug: true });
export type UpdateSerieInputType = z.infer<typeof UpdateSerieInputSchema>;

export const UpdateSerieOutputSchema = SerieSchema.pick({
	slug: true,
});
export type UpdateSerieOutputType = z.infer<typeof UpdateSerieOutputSchema>;

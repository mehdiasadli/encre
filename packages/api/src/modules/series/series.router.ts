import {
	AuthorGetSeriesListOutputSchema,
	CreateSerieInputSchema,
	CreateSerieOutputSchema,
	DeleteSerieInputSchema,
	DeleteSerieOutputSchema,
	GetSerieInputSchema,
	GetSerieOutputSchema,
	ResourceStatusSchema,
	UpdateSerieInputSchema,
	UpdateSerieOutputSchema,
} from "@encre/schemas";
import { authorProcedure } from "../../procedures";
import { SeriesService } from "./series.service";

export const seriesRouter = {
	authorGetSeriesList: authorProcedure
		.output(AuthorGetSeriesListOutputSchema)
		.handler(
			async ({ context }) =>
				await SeriesService.authorGetSeriesList(context.author.id),
		),
	createSerie: authorProcedure
		.input(CreateSerieInputSchema)
		.output(CreateSerieOutputSchema)
		.handler(
			async ({ input, context }) =>
				await SeriesService.createSerie(input, context.author.id),
		),
	updateSerie: authorProcedure
		.input(
			UpdateSerieInputSchema.extend({
				status: ResourceStatusSchema.exclude(["deleted"]).optional(),
			}),
		)
		.output(UpdateSerieOutputSchema)
		.handler(
			async ({ input, context }) =>
				await SeriesService.updateSerie(input, context.author.id),
		),
	deleteSerie: authorProcedure
		.input(DeleteSerieInputSchema)
		.output(DeleteSerieOutputSchema)
		.handler(
			async ({ input, context }) =>
				await SeriesService.deleteSerie(input, context.author.id),
		),
	authorGetSerie: authorProcedure
		.input(GetSerieInputSchema)
		.output(GetSerieOutputSchema)
		.handler(
			async ({ input, context }) =>
				await SeriesService.authorGetSerie(input, context.author.id),
		),
};

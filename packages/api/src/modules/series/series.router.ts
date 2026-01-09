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
import { createSerie } from "./services/create-serie";
import { deleteSerie } from "./services/delete-serie";
import { authorGetSeriesList } from "./services/get-many-serie";
import { authorGetSerie } from "./services/get-one-serie";
import { updateSerie } from "./services/update-serie";

export const seriesRouter = {
	authorGetSeriesList: authorProcedure
		.output(AuthorGetSeriesListOutputSchema)
		.handler(
			async ({ context }) => await authorGetSeriesList(context.author.id),
		),
	createSerie: authorProcedure
		.input(CreateSerieInputSchema)
		.output(CreateSerieOutputSchema)
		.handler(
			async ({ input, context }) => await createSerie(input, context.author.id),
		),
	updateSerie: authorProcedure
		.input(
			UpdateSerieInputSchema.extend({
				status: ResourceStatusSchema.exclude(["deleted"]).optional(),
			}),
		)
		.output(UpdateSerieOutputSchema)
		.handler(
			async ({ input, context }) => await updateSerie(input, context.author.id),
		),
	deleteSerie: authorProcedure
		.input(DeleteSerieInputSchema)
		.output(DeleteSerieOutputSchema)
		.handler(
			async ({ input, context }) => await deleteSerie(input, context.author.id),
		),
	authorGetSerie: authorProcedure
		.input(GetSerieInputSchema)
		.output(GetSerieOutputSchema)
		.handler(
			async ({ input, context }) =>
				await authorGetSerie(input, context.author.id),
		),
};

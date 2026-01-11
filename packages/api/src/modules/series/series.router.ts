import {
	AuthorGetManySerieOutputSchema,
	AuthorGetOneSerieInputSchema,
	AuthorGetOneSerieOutputSchema,
	CreateSerieInputSchema,
	CreateSerieOutputSchema,
	DeleteSerieInputSchema,
	DeleteSerieOutputSchema,
	ResourceStatusSchema,
	UpdateSerieInputSchema,
	UpdateSerieOutputSchema,
} from "@encre/schemas";
import { authorProcedure } from "../../procedures";
import {
	authorGetManySerie,
	authorGetOneSerie,
	createSerie,
	deleteSerie,
	updateSerie,
} from "./services";

export const seriesRouter = {
	// get one
	authorGetOneSerie: authorProcedure
		.input(AuthorGetOneSerieInputSchema)
		.output(AuthorGetOneSerieOutputSchema)
		.handler(
			async ({ input, context }) =>
				await authorGetOneSerie(input, context.author.id),
		),
	// get many
	authorGetManySerie: authorProcedure
		.output(AuthorGetManySerieOutputSchema)
		.handler(
			async ({ context }) => await authorGetManySerie(context.author.id),
		),
	// create
	createSerie: authorProcedure
		.input(CreateSerieInputSchema)
		.output(CreateSerieOutputSchema)
		.handler(
			async ({ input, context }) => await createSerie(input, context.author.id),
		),
	// update
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
	// delete
	deleteSerie: authorProcedure
		.input(DeleteSerieInputSchema)
		.output(DeleteSerieOutputSchema)
		.handler(
			async ({ input, context }) => await deleteSerie(input, context.author.id),
		),
};

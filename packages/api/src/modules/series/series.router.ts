import {
	AdminGetSerieOutputSchema,
	AdminGetSeriesListInputSchema,
	AdminGetSeriesListOutputSchema,
	AuthorGetSerieOutputSchema,
	AuthorGetSeriesListOutputSchema,
	CreateSerieInputSchema,
	CreateSerieOutputSchema,
	DeleteSerieInputSchema,
	DeleteSerieOutputSchema,
	GetSerieInputSchema,
	GetSerieOutputSchema,
	GetSeriesListOutputSchema,
	ResourceStatusSchema,
	UpdateSerieInputSchema,
	UpdateSerieOutputSchema,
} from "@encre/schemas";
import {
	authorProcedure,
	moderatorOrAdminProcedure,
	publicProcedure,
} from "../../procedures";
import { createSerie } from "./services/create-serie";
import { deleteSerie } from "./services/delete-serie";
import {
	adminGetSeriesList,
	authorGetSeriesList,
	getSeriesList,
} from "./services/get-many-serie";
import {
	adminGetSerie,
	authorGetSerie,
	getSerie,
} from "./services/get-one-serie";
import { updateSerie } from "./services/update-serie";

export const seriesRouter = {
	// get one
	getSerie: publicProcedure
		.input(GetSerieInputSchema)
		.output(GetSerieOutputSchema)
		.handler(
			async ({ input, context }) => await getSerie(input, context.user?.id),
		),
	authorGetSerie: authorProcedure
		.input(GetSerieInputSchema)
		.output(AuthorGetSerieOutputSchema)
		.handler(
			async ({ input, context }) =>
				await authorGetSerie(input, context.author.id),
		),
	adminGetSerie: moderatorOrAdminProcedure
		.input(GetSerieInputSchema)
		.output(AdminGetSerieOutputSchema)
		.handler(async ({ input }) => await adminGetSerie(input)),
	// get many
	getSeriesList: publicProcedure
		.output(GetSeriesListOutputSchema)
		.handler(async ({ context }) => await getSeriesList(context.user?.id)),
	authorGetSeriesList: authorProcedure
		.output(AuthorGetSeriesListOutputSchema)
		.handler(
			async ({ context }) => await authorGetSeriesList(context.author.id),
		),
	adminGetSeriesList: moderatorOrAdminProcedure
		.input(AdminGetSeriesListInputSchema)
		.output(AdminGetSeriesListOutputSchema)
		.handler(async ({ input }) => await adminGetSeriesList(input)),
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

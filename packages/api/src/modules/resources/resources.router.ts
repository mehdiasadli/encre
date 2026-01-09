import {
	AuthorSearchResourceInputSchema,
	AuthorSearchResourceOutputSchema,
} from "@encre/schemas";
import { authorProcedure } from "../../procedures";
import { ResourcesService } from "./resources.service";

export const resourcesRouter = {
	authorSearchResource: authorProcedure
		.input(AuthorSearchResourceInputSchema)
		.output(AuthorSearchResourceOutputSchema)
		.handler(
			async ({ input, context }) =>
				await ResourcesService.authorSearchResource(input, context.author.id),
		),
};

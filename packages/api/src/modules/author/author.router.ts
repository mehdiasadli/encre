import {
	BecomeAuthorInputSchema,
	BecomeAuthorOutputSchema,
	GetMyAuthorOutputSchema,
} from "@encre/schemas";
import { protectedProcedure } from "../../procedures";
import { AuthorService } from "./author.service";

export const authorRouter = {
	getMyAuthor: protectedProcedure
		.output(GetMyAuthorOutputSchema)
		.handler(
			async ({ context }) => await AuthorService.getMyAuthor(context.user.id),
		),
	becomeAuthor: protectedProcedure
		.input(BecomeAuthorInputSchema)
		.output(BecomeAuthorOutputSchema)
		.handler(
			async ({ input, context }) =>
				await AuthorService.becomeAuthor(context.user.id, input),
		),
};

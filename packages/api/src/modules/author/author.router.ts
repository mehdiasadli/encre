import {
	CreateAuthorInputSchema,
	CreateAuthorOutputSchema,
	GetMyAuthorOutputSchema,
} from "@encre/schemas";
import { protectedProcedure } from "../../procedures";
import { createAuthor, getMyAuthor } from "./services";

export const authorRouter = {
	getMyAuthor: protectedProcedure
		.output(GetMyAuthorOutputSchema)
		.handler(async ({ context }) => getMyAuthor(context.user.id)),
	createAuthor: protectedProcedure
		.input(CreateAuthorInputSchema)
		.output(CreateAuthorOutputSchema)
		.handler(
			async ({ input, context }) => await createAuthor(input, context.user.id),
		),
};

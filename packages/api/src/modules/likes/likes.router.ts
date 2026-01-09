import {
	GetLikesOfResourceInputSchema,
	GetLikesOfResourceOutputSchema,
	GetLikesOfUserInputSchema,
	GetLikesOfUserOutputSchema,
	LikeInputSchema,
	LikeOutputSchema,
} from "@encre/schemas";
import { protectedProcedure } from "../..";
import { LikesService } from "./likes.service";

export const likesRouter = {
	likeResource: protectedProcedure
		.input(LikeInputSchema)
		.output(LikeOutputSchema)
		.handler(
			async ({ input, context }) =>
				await LikesService.likeResource(input, context.session.user.id),
		),
	getLikesOfResource: protectedProcedure
		.input(GetLikesOfResourceInputSchema)
		.output(GetLikesOfResourceOutputSchema)
		.handler(async ({ input }) => await LikesService.getLikesOfResource(input)),
	getLikesOfUser: protectedProcedure
		.input(GetLikesOfUserInputSchema)
		.output(GetLikesOfUserOutputSchema)
		.handler(async ({ input }) => await LikesService.getLikesOfUser(input)),
};

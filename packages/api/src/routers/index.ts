import type { RouterClient } from "@orpc/server";

import { authorRouter } from "../modules/author/author.router";
import { booksRouter } from "../modules/books/books.router";
import { seriesRouter } from "../modules/series/series.router";
import { protectedProcedure, publicProcedure } from "../procedures";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	privateData: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			user: context.user,
		};
	}),

	author: authorRouter,
	series: seriesRouter,
	books: booksRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;

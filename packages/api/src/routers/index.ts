/** biome-ignore-all assist/source/organizeImports: no need to organize imports */
import type { RouterClient } from "@orpc/server";

import { authorRouter } from "../modules/author/author.router";
import { booksRouter } from "../modules/books/books.router";
import { chaptersRouter } from "../modules/chapters/chapters.router";
import { charactersRouter } from "../modules/characters/characters.router";
import { feedbackRouter } from "../modules/feedback/feedback.router";
import { resourcesRouter } from "../modules/resources/resources.router";
import { seriesRouter } from "../modules/series/series.router";

export const appRouter = {
	author: authorRouter,
	serie: seriesRouter,
	books: booksRouter,
	chapter: chaptersRouter,
	resource: resourcesRouter,
	feedback: feedbackRouter,
	character: charactersRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;

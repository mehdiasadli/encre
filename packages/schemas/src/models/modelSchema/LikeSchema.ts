import { z } from "zod";
import { LikeResourceSchema } from "../inputTypeSchemas/LikeResourceSchema";

/////////////////////////////////////////
// LIKE SCHEMA
/////////////////////////////////////////

export const LikeSchema = z.object({
	resource: LikeResourceSchema,
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	userId: z.uuid({ message: "Invalid user ID" }),
	postId: z.uuid({ message: "Invalid post ID" }).nullish(),
	serieId: z.uuid({ message: "Invalid serie ID" }).nullish(),
	bookId: z.uuid({ message: "Invalid book ID" }).nullish(),
	chapterId: z.uuid({ message: "Invalid chapter ID" }).nullish(),
	characterId: z.uuid({ message: "Invalid character ID" }).nullish(),
	placeId: z.uuid({ message: "Invalid place ID" }).nullish(),
	authorId: z.uuid({ message: "Invalid author ID" }).nullish(),
	articleId: z.uuid({ message: "Invalid article ID" }).nullish(),
	commentId: z.uuid({ message: "Invalid comment ID" }).nullish(),
});

export type Like = z.infer<typeof LikeSchema>;

export default LikeSchema;

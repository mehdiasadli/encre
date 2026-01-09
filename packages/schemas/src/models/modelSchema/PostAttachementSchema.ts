import { z } from "zod";
import { PostAttachementTypeSchema } from "../inputTypeSchemas/PostAttachementTypeSchema";

/////////////////////////////////////////
// POST ATTACHEMENT SCHEMA
/////////////////////////////////////////

export const PostAttachementSchema = z.object({
	type: PostAttachementTypeSchema,
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	postId: z.uuid({ message: "Invalid post ID" }),
	serieId: z.uuid({ message: "Invalid serie ID" }).nullish(),
	bookId: z.uuid({ message: "Invalid book ID" }).nullish(),
	chapterId: z.uuid({ message: "Invalid chapter ID" }).nullish(),
	characterId: z.uuid({ message: "Invalid character ID" }).nullish(),
	placeId: z.uuid({ message: "Invalid place ID" }).nullish(),
	authorId: z.uuid({ message: "Invalid author ID" }).nullish(),
	attachedPostId: z.uuid({ message: "Invalid attached post ID" }).nullish(),
});

export type PostAttachement = z.infer<typeof PostAttachementSchema>;

export default PostAttachementSchema;

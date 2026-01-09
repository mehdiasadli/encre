import { z } from "zod";

/////////////////////////////////////////
// SHELF BOOK SCHEMA
/////////////////////////////////////////

export const ShelfBookSchema = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	shelfId: z.uuid({ message: "Invalid shelf ID" }),
	bookId: z.uuid({ message: "Invalid book ID" }),
	order: z
		.number()
		.int({ message: "Invalid order" })
		.min(1, { message: "Order must be at least 1" })
		.nullish(),
});

export type ShelfBook = z.infer<typeof ShelfBookSchema>;

export default ShelfBookSchema;

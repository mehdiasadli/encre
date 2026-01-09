import { z } from "zod";

export const ShelfBookScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"shelfId",
	"bookId",
	"order",
]);

export default ShelfBookScalarFieldEnumSchema;

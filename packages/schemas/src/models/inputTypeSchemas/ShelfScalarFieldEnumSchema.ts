import { z } from "zod";

export const ShelfScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"slug",
	"visibility",
	"name",
	"description",
	"image",
	"userId",
	"isOrdered",
]);

export default ShelfScalarFieldEnumSchema;

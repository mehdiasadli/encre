import { z } from "zod";

export const PlaceScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"slug",
	"name",
	"address",
	"lat",
	"lng",
	"description",
	"image",
	"serieId",
	"depth",
	"parentId",
]);

export default PlaceScalarFieldEnumSchema;

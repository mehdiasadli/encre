import { z } from "zod";
import { slugRegex } from "../../regex";

/////////////////////////////////////////
// PLACE SCHEMA
/////////////////////////////////////////

export const PlaceSchema = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	slug: z.string().regex(slugRegex, { message: "Invalid slug" }),
	name: z
		.string()
		.min(1, { message: "Name is required" })
		.max(100, { message: "Name cannot exceed 100 characters" }),
	address: z
		.string()
		.max(512, { message: "Address cannot exceed 512 characters" })
		.nullish(),
	lat: z
		.number()
		.refine((value) => value >= -90 && value <= 90, {
			message: "Latitude must be between -90 and 90",
		})
		.nullish(),
	lng: z
		.number()
		.refine((value) => value >= -180 && value <= 180, {
			message: "Longitude must be between -180 and 180",
		})
		.nullish(),
	description: z
		.string()
		.max(1000, { message: "Description cannot exceed 1000 characters" })
		.nullish(),
	image: z.url({ message: "Invalid image URL" }).nullish(),
	serieId: z.uuid({ message: "Invalid serie ID" }),
	depth: z
		.number()
		.int({ message: "Invalid depth" })
		.min(0, { message: "Depth must be at least 0" })
		.max(10, { message: "Depth cannot exceed 10" }),
	parentId: z.uuid({ message: "Invalid parent ID" }).nullish(),
});

export type Place = z.infer<typeof PlaceSchema>;

/////////////////////////////////////////
// PLACE CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const PlaceCustomValidatorsSchema = PlaceSchema;

export type PlaceCustomValidators = z.infer<typeof PlaceCustomValidatorsSchema>;

export default PlaceSchema;

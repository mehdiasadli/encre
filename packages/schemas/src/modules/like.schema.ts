import z from "zod";
import {
	PaginationInputSchema,
	PaginationOutputSchema,
	RangeFilterSchema,
	SearchSchema,
	SortingSchema,
} from "../common.schema";
import { LikeResourceSchema, LikeSchema, UserSchema } from "../models";

export const LikeActionSchema = z.enum(["liked", "unliked"]);
export type LikeActionType = z.infer<typeof LikeActionSchema>;

////
// LIKE/UNLIKE
////
export const LikeInputSchema = z.object({
	type: LikeResourceSchema,
	slug: z.string(),
});

export const LikeOutputSchema = LikeInputSchema.extend({
	action: LikeActionSchema,
});

export type LikeInputType = z.infer<typeof LikeInputSchema>;
export type LikeOutputType = z.infer<typeof LikeOutputSchema>;

////
// GET LIKES
////
export const GetLikesOfResourceInputSchema = z
	.object({
		type: LikeResourceSchema,
		slug: z.string(),
	})
	.extend({
		pagination: PaginationInputSchema,
		sorting: SortingSchema(["createdAt"]),
		search: SearchSchema,
		range: RangeFilterSchema,
	});

export const GetLikesOfResourceOutputSchema = PaginationOutputSchema(
	LikeSchema.pick({
		createdAt: true,
	}).extend({
		user: UserSchema.pick({
			username: true,
			image: true,
			name: true,
		}),
	}),
);

export type GetLikesOfResourceInputType = z.infer<
	typeof GetLikesOfResourceInputSchema
>;
export type GetLikesOfResourceOutputType = z.infer<
	typeof GetLikesOfResourceOutputSchema
>;

////
// GET LIKES OF USER
////
export const GetLikesOfUserInputSchema = z
	.object({
		username: UserSchema.shape.username,
	})
	.extend({
		pagination: PaginationInputSchema,
		sorting: SortingSchema(["createdAt"]),
		search: SearchSchema,
		range: RangeFilterSchema,
	});

export const GetLikesOfUserOutputSchema = PaginationOutputSchema(
	LikeSchema.pick({
		createdAt: true,
	}).extend({
		resource: z.object({
			type: LikeResourceSchema,
			slug: z.string(),
			title: z.string().nullable(),
			image: z.string().nullable(),
		}),
	}),
);

export type GetLikesOfUserInputType = z.infer<typeof GetLikesOfUserInputSchema>;
export type GetLikesOfUserOutputType = z.infer<
	typeof GetLikesOfUserOutputSchema
>;

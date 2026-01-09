import type { PaginationInputType, PaginationOutputType } from "@encre/schemas";
import type z from "zod";

export const paginate = {
	input: (pagination: PaginationInputType) => {
		return {
			skip: (pagination.page - 1) * pagination.take,
			take: pagination.take,
		};
	},
	output: <T>(
		items: T[],
		totalItems: number,
		pagination: PaginationInputType,
	): PaginationOutputType<z.ZodType<T>> => {
		return {
			items,
			totalItems,
			totalPages: Math.ceil(totalItems / pagination.take),
			page: pagination.page,
			take: pagination.take,
			hasNextPage: pagination.page * pagination.take < totalItems,
		};
	},
};

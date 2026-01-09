import { ORPCError } from "@orpc/client";
import type {
	DataTag,
	MutationFunctionContext,
	QueryKey,
	UseMutationOptions,
	UseMutationResult,
} from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// biome-ignore lint/suspicious/noExplicitAny: ORPCError types
type ORPCErrorType = ORPCError<any, any>;

function toORPCError(error: unknown): ORPCErrorType {
	if (error instanceof ORPCError) {
		return error;
	}

	if (error instanceof Error) {
		return new ORPCError("INTERNAL_SERVER_ERROR", {
			message: error.message,
			cause: error,
		});
	}

	return new ORPCError("INTERNAL_SERVER_ERROR", {
		message: "An unknown error occurred",
		cause: error,
	});
}

export function defaultORPCErrorHandler(error: ORPCErrorType) {
	toast.error(error.message ?? "An unknown error occurred");
}

type MutationOptionsWithORPCError<TData, TVariables, TContext> = Omit<
	UseMutationOptions<TData, ORPCErrorType, TVariables, TContext>,
	"mutationFn"
> & {
	mutationFn?: UseMutationOptions<
		TData,
		Error,
		TVariables,
		TContext
	>["mutationFn"];
	showErrorToast?: boolean;
	invalidateQueries?:
		| DataTag<QueryKey, any, any>[]
		| ((
				data: TData,
				variables: TVariables,
				onMutateResult: TContext,
				context: MutationFunctionContext,
		  ) => DataTag<QueryKey, any, any>[]);
};

export function useORPCMutation<
	TData = unknown,
	TVariables = void,
	TContext = unknown,
>(
	options: MutationOptionsWithORPCError<TData, TVariables, TContext>,
): UseMutationResult<TData, ORPCErrorType, TVariables, TContext> {
	const queryClient = useQueryClient();
	const {
		onError,
		onSettled,
		onSuccess,
		showErrorToast = true,
		invalidateQueries = [],
		...rest
	} = options;

	return useMutation({
		...rest,
		onError: (error, variables, onMutateResult, context) => {
			const orpcError = toORPCError(error);

			if (showErrorToast) {
				defaultORPCErrorHandler(orpcError);
			}

			onError?.(orpcError, variables, onMutateResult, context);
		},
		onSettled: (data, error, variables, onMutateResult, context) => {
			const orpcError = error ? toORPCError(error) : null;
			onSettled?.(data, orpcError, variables, onMutateResult, context);
		},
		onSuccess: async (data, variables, onMutateResult, context) => {
			const queryKeys =
				typeof invalidateQueries === "function"
					? invalidateQueries(data, variables, onMutateResult, context)
					: invalidateQueries;

			await Promise.all(
				queryKeys.map(async (queryKey) => {
					await queryClient.invalidateQueries({ queryKey });
				}),
			);

			onSuccess?.(data, variables, onMutateResult, context);
		},
	}) as UseMutationResult<TData, ORPCErrorType, TVariables, TContext>;
}

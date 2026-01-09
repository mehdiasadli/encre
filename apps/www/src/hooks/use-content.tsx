/*
Usage:

function Component() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery(...);
  const { content } = useContent({ data, isLoading, error, refetch, isRefetching });

  return content;
}
*/

import {
	type DefaultError,
	type QueryKey,
	type UseQueryOptions,
	useQuery,
} from "@tanstack/react-query";
import { useCallback } from "react";
import ServerErrorComponent from "@/components/server-error-component";
import ServerLoader from "@/components/server-loading-component";

interface UseContentConfig {
	loadingComponent?: React.ReactNode;
	loadingProps?: Omit<React.ComponentProps<typeof ServerLoader>, "isLoading">;
	errorComponent?: React.ReactNode;
	errorProps?: Omit<
		React.ComponentProps<typeof ServerErrorComponent>,
		"error" | "retry" | "isRetrying"
	>;
}

interface UseContentProps<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
> extends UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {
	config?: UseContentConfig;
}

interface RenderProps extends UseContentConfig {}

export function useContent<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>({
	config = {},
	...options
}: UseContentProps<TQueryFnData, TError, TData, TQueryKey>) {
	const result = useQuery(options);

	const content = useCallback(
		(render: (data: TData) => React.ReactNode, props: RenderProps = {}) => {
			if (result.isLoading) {
				return (
					props.loadingComponent ??
					config.loadingComponent ?? (
						<ServerLoader
							isLoading
							{...(props.loadingProps ?? config.loadingProps)}
						/>
					)
				);
			}

			if (result.error) {
				return (
					props.errorComponent ??
					config.errorComponent ?? (
						<ServerErrorComponent
							error={result.error as unknown as Error}
							retry={result.refetch}
							isRetrying={result.isFetching}
							{...(props.errorProps ?? config.errorProps)}
						/>
					)
				);
			}

			if (!result.data) return null;

			return render(result.data);
		},
		[
			result.isLoading,
			result.error,
			result.data,
			result.refetch,
			result.isFetching,
			config.loadingComponent,
			config.errorComponent,
			config.loadingProps,
			config.errorProps,
		],
	);

	return {
		content,
		...result,
	};
}

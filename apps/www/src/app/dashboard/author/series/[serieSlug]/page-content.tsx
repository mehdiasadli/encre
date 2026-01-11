"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import {
	Alert,
	AlertAction,
	AlertDescription,
	AlertTitle,
} from "@/components/ui/alert";
import { LoadingButton } from "@/components/ui/loading-button";
import { orpc } from "@/utils/orpc";
import { SerieBooklist, SerieBooklistLoading } from "./serie-booklist";
import { SerieHeader, SerieHeaderLoading } from "./serie-header";

export function SeriePageContent({ slug }: { slug: string }) {
	const {
		data: serie,
		isLoading,
		error,
		refetch,
		isRefetching,
	} = useQuery(
		orpc.serie.authorGetOneSerie.queryOptions({
			input: { slug },
		}),
	);

	if (isLoading) {
		return (
			<div className="space-y-4">
				<SerieHeaderLoading />
				<SerieBooklistLoading />
			</div>
		);
	}

	if (error) {
		return (
			<div>
				<Alert variant="error">
					<AlertTriangle />
					<AlertTitle>Error Occured While Fetching the Serie</AlertTitle>
					<AlertDescription>{error.message}</AlertDescription>
					<AlertAction>
						<LoadingButton
							loadingText="Retrying"
							variant="destructive"
							onClick={() => refetch()}
							isLoading={isRefetching}
						>
							<RefreshCcw />
							Retry
						</LoadingButton>
					</AlertAction>
				</Alert>
			</div>
		);
	}

	if (!serie || serie.status === "deleted") {
		return null;
	}

	return (
		<div className="space-y-4">
			<SerieHeader serie={serie} />
			<SerieBooklist serie={serie} />
		</div>
	);
}

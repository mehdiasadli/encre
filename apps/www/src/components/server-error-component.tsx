"use client";

import { AlertCircleIcon, RefreshCcwIcon } from "lucide-react";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./ui/alert";
import { LoadingButton } from "./ui/loading-button";

interface ServerErrorComponentProps
	extends Omit<React.ComponentProps<typeof Alert>, "children" | "title"> {
	error: Error;
	retry?: () => void;
	isRetrying?: boolean;

	title?: React.ReactNode;
	icon?: React.ReactNode;
	actionIcon?: React.ReactNode;

	titleClassName?: string;
	descriptionClassName?: string;

	showAction?: boolean;
	actionClassName?: string;
	actionLabel?: string;
	actionProps?: Omit<
		React.ComponentProps<typeof LoadingButton>,
		"children" | "isLoading"
	>;
	onRetry?: () => void;
}

export default function ServerErrorComponent({
	error,
	retry,
	isRetrying = false,
	title = "Error",
	icon = <AlertCircleIcon />,
	actionIcon = <RefreshCcwIcon />,
	titleClassName,
	descriptionClassName,
	actionClassName,
	actionLabel = "Retry",
	onRetry,
	showAction = true,
	actionProps,
	...props
}: ServerErrorComponentProps) {
	const handleRetry = useCallback(() => {
		onRetry?.();
		retry?.();
	}, [onRetry, retry]);

	return (
		<Alert className={cn("mx-auto max-w-md", props.className)} {...props}>
			{icon}
			<AlertTitle className={titleClassName}>{title}</AlertTitle>
			<AlertDescription className={descriptionClassName}>
				{error.message || "An unknown error occurred"}
			</AlertDescription>
			{showAction && retry && (
				<AlertAction>
					<LoadingButton
						isLoading={isRetrying}
						onClick={handleRetry}
						{...actionProps}
						className={actionClassName}
					>
						{actionIcon}
						{actionLabel}
					</LoadingButton>
				</AlertAction>
			)}
		</Alert>
	);
}

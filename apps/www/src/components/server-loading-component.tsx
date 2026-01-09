import type React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";

interface ServerLoaderProps
	extends Omit<React.ComponentProps<"div">, "title" | "children"> {
	isLoading: boolean;
	loadingLabel?: string;
	labelClassName?: string;
	icon?: React.ReactNode;
}

export default function ServerLoader({
	isLoading,
	loadingLabel,
	icon = <Spinner />,
	labelClassName,
	...props
}: ServerLoaderProps) {
	if (!isLoading) return null;

	return (
		<div
			{...props}
			className={cn(
				"mt-8 flex h-full w-full items-center justify-center gap-2",
				props?.className,
			)}
		>
			{icon}
			{loadingLabel && <span className={labelClassName}>{loadingLabel}</span>}
		</div>
	);
}

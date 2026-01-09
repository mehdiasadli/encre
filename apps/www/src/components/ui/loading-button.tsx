import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Spinner } from "./spinner";

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
	isLoading?: boolean;
	classNameOnLoading?: string;
	disableOnLoading?: boolean;
	cursorOnLoading?: CSSProperties["cursor"];
	loadingText?: string;
	loadingTextClassName?: string;
	loadingIcon?: React.ReactNode;
	loadingIconPosition?: "start" | "end";
}

export function LoadingButton({
	isLoading,
	children,
	disableOnLoading = true,
	classNameOnLoading,
	loadingText,
	loadingTextClassName,
	cursorOnLoading = "not-allowed",
	loadingIcon = <Spinner />,
	loadingIconPosition = "start",
	className,
	...props
}: LoadingButtonProps) {
	const content = !isLoading ? (
		children
	) : (
		<div className="flex items-center gap-2">
			{loadingIconPosition === "start" && loadingIcon}
			{loadingText && (
				<span className={cn("text-sm", loadingTextClassName)}>
					{loadingText}
				</span>
			)}
			{loadingIconPosition === "end" && loadingIcon}
		</div>
	);

	return (
		<Button
			{...props}
			disabled={isLoading && disableOnLoading ? true : props.disabled}
			className={cn(
				className,
				isLoading &&
					`${cursorOnLoading && `cursor-${cursorOnLoading}`} ${classNameOnLoading}`,
			)}
		>
			{content}
		</Button>
	);
}

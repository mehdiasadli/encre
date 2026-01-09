"use client";

import { ArrowLeft } from "lucide-react";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { usePageTrackerStore } from "react-page-tracker";
import { Button } from "./ui/button";

interface BackButtonProps
	extends Omit<React.ComponentProps<typeof Button>, "children"> {
	backLink?: Route;
	children?: React.ReactNode;
}

export function BackButton({
	backLink = "/",
	children,
	...props
}: BackButtonProps) {
	const router = useRouter();
	const pathname = usePathname();
	const isFirstPage = usePageTrackerStore((state) => state.isFirstPage);

	if (pathname === backLink) {
		return null;
	}

	return (
		<Button
			variant="ghost"
			size={!children ? "icon" : "default"}
			{...props}
			onClick={(e) => {
				if (isFirstPage) {
					router.push(backLink);
				} else {
					router.back();
				}

				props.onClick?.(e);
			}}
		>
			{children ?? <ArrowLeft />}
		</Button>
	);
}

BackButton.displayName = "BackButton";

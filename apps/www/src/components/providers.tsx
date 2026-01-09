"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { PageTracker } from "react-page-tracker";
import { queryClient } from "@/utils/orpc";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			disableTransitionOnChange
		>
			<QueryClientProvider client={queryClient}>
				<NuqsAdapter
					defaultOptions={{
						clearOnDefault: true,
					}}
				>
					<PageTracker />
					{children}
					<ReactQueryDevtools />
				</NuqsAdapter>
			</QueryClientProvider>
			<Toaster richColors />
		</ThemeProvider>
	);
}

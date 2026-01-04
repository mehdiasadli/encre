import type { Metadata } from "next";
import Providers from "@/components/providers";

import "../index.css";

export const metadata: Metadata = {
	title: "encre",
	description: "encre",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={"antialiased"}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

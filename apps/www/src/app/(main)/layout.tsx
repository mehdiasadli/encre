import { Suspense } from "react";
import { Header } from "@/components/header";

export default function MainLayout({ children }: LayoutProps<"/">) {
	return (
		<div>
			<Suspense>
				<Header />
			</Suspense>
			{children}
		</div>
	);
}

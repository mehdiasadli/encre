import { Header } from "@/components/header";

export default function MainLayout({ children }: LayoutProps<"/">) {
	return (
		<div>
			<Header />
			{children}
		</div>
	);
}

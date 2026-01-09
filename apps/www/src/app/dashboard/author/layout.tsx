import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthorGlobalSearchDialog } from "@/components/author-global-search-dialog";
import { BackButton } from "@/components/back-button";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

export const iframeHeight = "800px";

export default async function AuthorLayout({
	children,
}: LayoutProps<"/dashboard/author">) {
	const session = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
		},
	});

	if (!session || !session.data?.user || !session.data?.user.isAuthor) {
		redirect("/?auth=sign-in&callbackURL=/dashboard/author");
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 px-4">
					<div className="flex items-center gap-2 px-4">
						<BackButton backLink="/dashboard/author">
							<ArrowLeft />
							Back
						</BackButton>
						<SidebarTrigger className="-ml-1" />
					</div>
					<div className="ml-auto">
						<AuthorGlobalSearchDialog />
					</div>
				</header>
				<main className="px-4 py-4">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

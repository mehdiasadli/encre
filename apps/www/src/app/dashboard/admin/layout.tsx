import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default async function AdminLayout({
	children,
}: LayoutProps<"/dashboard/admin">) {
	const session = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
		},
	});

	if (
		!session ||
		!session.data?.user ||
		["admin", "moderator"].includes(session.data?.user.role ?? "")
	) {
		redirect("/?auth=sign-in&callbackURL=/dashboard/admin");
	}

	return <div>{children}</div>;
}

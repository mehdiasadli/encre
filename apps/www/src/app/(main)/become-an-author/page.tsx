import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { BecomeAuthorForm } from "./become-author-form";

export default async function BecomeAnAuthorPage() {
	const session = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
		},
	});

	if (!session || !session.data?.user) {
		redirect("/?sign-in=true&callbackURL=/become-an-author");
	}

	if (session.data?.user.isAuthor) {
		redirect("/dashboard/author");
	}

	return (
		<Suspense>
			<BecomeAuthorForm
				username={session.data.user.username}
				name={session.data.user.name}
			/>
		</Suspense>
	);
}

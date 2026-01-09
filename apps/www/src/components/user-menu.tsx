"use client";

import {
	Bell,
	LayoutDashboard,
	Library,
	LogOut,
	PencilIcon,
	Settings,
	ShieldCheck,
	UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	Menu,
	MenuGroup,
	MenuGroupLabel,
	MenuItem,
	MenuPopup,
	MenuTrigger,
} from "./ui/menu";

export function UserMenu() {
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onError(error) {
					toast.error(
						error.error.message ??
							error.error.statusText ??
							"An unknown error occurred",
					);
				},
				onSuccess() {
					router.refresh();
				},
			},
		});
	};

	if (isPending || !session) return null;

	return (
		<Menu>
			<MenuTrigger>
				<Avatar>
					<AvatarImage src={session.user.image ?? undefined} />
					<AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
				</Avatar>
			</MenuTrigger>
			<MenuPopup>
				<MenuGroup>
					<MenuGroupLabel>Account</MenuGroupLabel>
					<MenuItem render={<Link href={`/users/${session.user.username}`} />}>
						<UserIcon />
						Profile
					</MenuItem>
					<MenuItem
						render={<Link href={`/users/${session.user.username}/library`} />}
					>
						<Library />
						Library
					</MenuItem>
					<MenuItem
						render={
							<Link href={`/users/${session.user.username}/notifications`} />
						}
					>
						<Bell />
						Notifications
					</MenuItem>
					<MenuItem
						render={<Link href={`/users/${session.user.username}/settings`} />}
					>
						<Settings />
						Settings
					</MenuItem>
				</MenuGroup>
				{session.user.isAuthor && (
					<MenuGroup>
						<MenuGroupLabel>Author</MenuGroupLabel>
						<MenuItem render={<Link href={"/dashboard/author"} />}>
							<LayoutDashboard />
							Dashboard
						</MenuItem>
					</MenuGroup>
				)}
				{session.user.role &&
					["moderator", "admin"].includes(session.user.role) && (
						<MenuGroup>
							<MenuGroupLabel>Admin</MenuGroupLabel>
							<MenuItem render={<Link href={"/dashboard/admin"} />}>
								<ShieldCheck />
								Dashboard
							</MenuItem>
						</MenuGroup>
					)}
				<MenuGroup>
					<MenuGroupLabel>Actions</MenuGroupLabel>
					{!session.user.isAuthor && (
						<MenuItem render={<Link href={"/become-an-author"} />}>
							<PencilIcon />
							Become an author
						</MenuItem>
					)}
					<MenuItem className="text-destructive" onClick={handleLogout}>
						<LogOut />
						Logout
					</MenuItem>
				</MenuGroup>
			</MenuPopup>
		</Menu>
	);
}

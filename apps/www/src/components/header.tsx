"use client";

import Link from "next/link";
import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { SignInDialog } from "./sign-in-dialog";
import { SignUpDialog } from "./sign-up-dialog";
import { UserMenu } from "./user-menu";

export function Header() {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn("sticky top-0 z-50 w-full border-transparent border-b", {
				"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<div className="flex items-center gap-5">
					<Link href="/" className="rounded-md px-3 py-2.5 hover:bg-accent">
						<span className="font-bold text-lg">Encre</span>
					</Link>
					<DesktopNav />
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<SignInDialog render={<Button variant="outline">Sign In</Button>} />
					<SignUpDialog render={<Button>Get Started</Button>} />
					<UserMenu />
				</div>
				<div className="flex items-center gap-2 md:hidden">
					<MobileNav />
					<UserMenu />
				</div>
			</nav>
		</header>
	);
}

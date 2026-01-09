import Link from "next/link";
import {
	communityLinks,
	communityLinks2,
	discoverLinks,
} from "@/components/nav-links";
import { LinkItem } from "@/components/sheard";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function DesktopNav() {
	return (
		<NavigationMenu className="hidden md:flex">
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="bg-transparent">
						Discover
					</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 dark:bg-background">
						<div className="grid w-lg grid-cols-2 gap-2 rounded-md border bg-popover p-2 shadow">
							{discoverLinks.map((item, i) => (
								<NavigationMenuLink
									className="w-full flex-row gap-x-2"
									key={`item-${item.label}-${i}`}
									render={<LinkItem {...item} />}
								/>
							))}
						</div>
						<div className="p-2">
							<p className="text-muted-foreground text-sm">
								Want to write and share your stories?{" "}
								<Link
									className="font-medium text-foreground hover:underline"
									href="/become-an-author"
								>
									Become an author
								</Link>
							</p>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="bg-transparent">
						Community
					</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 pb-1.5 dark:bg-background">
						<div className="grid w-lg grid-cols-2 gap-2">
							<div className="space-y-2 rounded-md border bg-popover p-2 shadow">
								{communityLinks.map((item, i) => (
									<NavigationMenuLink
										className="w-full flex-row gap-x-2"
										key={`item-${item.label}-${i}`}
										render={<LinkItem {...item} />}
									/>
								))}
							</div>
							<div className="space-y-2 p-3">
								{communityLinks2.map((item, i) => (
									<NavigationMenuLink
										className="flex-row items-center gap-x-2"
										href={item.href}
										key={`item-${item.label}-${i}`}
									>
										<item.icon className="size-4 text-foreground" />
										<span className="font-medium">{item.label}</span>
									</NavigationMenuLink>
								))}
							</div>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuLink
					className="px-4"
					render={<Link className="rounded-md p-2 hover:bg-accent" href="/" />}
				>
					Home
				</NavigationMenuLink>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

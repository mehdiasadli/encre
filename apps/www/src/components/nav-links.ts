import {
	HelpCircle,
	Library,
	MessageCircle,
	Newspaper,
	Sparkles,
	Star,
	TrendingUp,
} from "lucide-react";
import type { LinkItemType } from "@/components/sheard";

export const discoverLinks: LinkItemType[] = [
	{
		label: "Browse Series",
		href: "/series",
		description: "Explore all published series",
		icon: Library,
	},
	{
		label: "New Releases",
		description: "Recently published chapters",
		href: "/chapters",
		icon: Sparkles,
	},
	{
		label: "Trending",
		description: "Popular series, books and chapters right now",
		href: "/trending",
		icon: TrendingUp,
	},
	{
		label: "Top Rated",
		description: "Highest rated series by the community",
		href: "/top-rated",
		icon: Star,
	},
];

export const communityLinks: LinkItemType[] = [
	{
		label: "Feed",
		href: "/feed",
		description: "Posts and updates from authors and readers",
		icon: Newspaper,
	},
	{
		label: "Discussions",
		href: "/discussions",
		description: "Join the conversation and share your thoughts",
		icon: MessageCircle,
	},
];

export const communityLinks2: LinkItemType[] = [
	{
		label: "Help Center",
		href: "/help-center",
		icon: HelpCircle,
	},
];

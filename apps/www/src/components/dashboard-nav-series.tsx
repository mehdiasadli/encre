"use client";

import type { ResourceStatusType } from "@encre/schemas/models/inputTypeSchemas/ResourceStatusSchema";
import { formatEnum } from "@encre/utils";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Plus, RefreshCcw } from "lucide-react";
import Link from "next/link";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function DashboardNavSeries() {
	const { data: session } = authClient.useSession();
	const {
		data: series,
		isLoading,
		error,
		refetch,
	} = useQuery(
		orpc.serie.authorGetManySerie.queryOptions({
			enabled: !!session,
		}),
	);

	const content =
		series && series.length > 0 ? (
			series.map((serie) => <SidebarItem key={serie.slug} item={serie} />)
		) : (
			<SidebarMenuItem>
				{isLoading ? (
					<SidebarMenuButton>
						<Spinner className="size-3 text-muted-foreground" />
						<span className="text-muted-foreground text-xs">
							Loading series...
						</span>
					</SidebarMenuButton>
				) : error ? (
					<SidebarMenuButton>
						<AlertTriangle className="size-3 text-destructive" />
						<Tooltip>
							<TooltipTrigger>
								<span className="text-destructive text-xs">Error</span>
							</TooltipTrigger>
							<TooltipContent>{error.message}</TooltipContent>
						</Tooltip>
						<Button
							variant="destructive"
							size="icon-xs"
							onClick={() => refetch()}
						>
							<RefreshCcw className="size-3" />
						</Button>
					</SidebarMenuButton>
				) : !series?.length ? (
					<SidebarMenuButton
						render={<Link href="/dashboard/author/series/create" />}
					>
						<Plus className="size-3 text-muted-foreground" />
						<span className="text-muted-foreground text-xs">
							Create your first series
						</span>
					</SidebarMenuButton>
				) : null}
			</SidebarMenuItem>
		);

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Series</SidebarGroupLabel>
			<SidebarMenu>{content}</SidebarMenu>
			{series?.length && (
				<SidebarMenuItem>
					<SidebarMenuButton
						className="text-muted-foreground text-xs"
						render={<Link href="/dashboard/author/series/create" />}
					>
						<Plus className="size-3" />
						<span>Add New Serie</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			)}
		</SidebarGroup>
	);
}

function SidebarItem({
	item,
}: {
	item: { slug: string; title: string; status: ResourceStatusType };
}) {
	const statusColor: Record<
		ResourceStatusType,
		React.ComponentProps<typeof Badge>["variant"]
	> = {
		draft: "default",
		published: "success",
		archived: "warning",
		coming_soon: "info",
		cancelled: "secondary",
		deleted: "destructive",
	};

	return (
		<SidebarMenuItem key={item.slug}>
			<SidebarMenuButton
				render={<Link href={`/dashboard/author/series/${item.slug}`} />}
			>
				<span title={item.title} className="truncate">
					{item.title}
				</span>
				<Badge
					title={`Status: ${formatEnum(item.status)}`}
					size="sm"
					variant={statusColor[item.status]}
				>
					{formatEnum(item.status)}
				</Badge>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

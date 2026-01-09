import type { GetSerieOutputType } from "@encre/schemas";
import { formatEnum } from "@encre/utils";
import { format } from "date-fns";
import { Edit3, Eye, EyeOff, Lock, Plus, Trash, Users } from "lucide-react";
import Link from "next/link";
import { DeleteResourceDialog } from "@/components/delete-resource-dialog";
import { EditResourceStatusSheet } from "@/components/edit-resource-status-sheet";
import { EditResourceVisibilitySheet } from "@/components/edit-resource-visibility-sheet";
import { EditSerieSheet } from "@/components/edit-serie-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SerieHeaderProps {
	serie: GetSerieOutputType;
}

export function SerieHeader({ serie }: SerieHeaderProps) {
	if (serie.status === "deleted") {
		return null;
	}

	const VisibilityIcon = {
		public: Eye,
		private: Lock,
		unlisted: EyeOff,
		followers: Users,
		members: Lock,
	}[serie.visibility];

	return (
		<div className="flex w-full flex-col gap-8 border-b bg-muted/30 px-6 py-8">
			<div className="flex-1 space-y-4">
				<div className="flex flex-wrap items-center gap-3">
					<EditResourceStatusSheet
						initialStatus={serie.status}
						slug={serie.slug}
						render={
							<Badge className="cursor-pointer" variant="outline">
								{formatEnum(serie.status)}
							</Badge>
						}
						type="serie"
					/>

					<EditResourceVisibilitySheet
						initialVisibility={serie.visibility}
						slug={serie.slug}
						type="serie"
						render={
							<div className="flex cursor-pointer items-center gap-1.5 border-l pl-3 font-medium text-muted-foreground text-xs">
								<VisibilityIcon className="h-3.5 w-3.5" />
								<span className="capitalize">{serie.visibility}</span>
							</div>
						}
					/>

					<DeleteResourceDialog
						slug={serie.slug}
						title={serie.title}
						type="serie"
						render={
							<Button variant="destructive" size="sm" className="ml-auto">
								<Trash className="h-4 w-4" />
								Delete
							</Button>
						}
					/>
				</div>

				<div className="space-y-1">
					<h1 className="font-bold text-3xl tracking-tight">{serie.title}</h1>
					<p className="text-muted-foreground text-sm">
						Series Slug:{" "}
						<code className="bg-muted px-1 py-0.5">{serie.slug}</code>
					</p>
				</div>

				{/* Dashboard Stats Grid */}
				<div className="grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
					<div className="border bg-background p-3">
						<p className="font-bold text-[10px] text-muted-foreground uppercase">
							Books
						</p>
						<p className="font-semibold text-xl">{serie._count.books}</p>
					</div>
					<div className="border bg-background p-3">
						<p className="font-bold text-[10px] text-muted-foreground uppercase">
							Total Likes
						</p>
						<p className="font-semibold text-xl">
							{serie._count.likes.toLocaleString()}
						</p>
					</div>
					<div
						title={format(serie.createdAt, "dd.MM.yyyy, HH:mm")}
						className="border bg-background p-3"
					>
						<p className="font-bold text-[10px] text-muted-foreground uppercase">
							Created At
						</p>
						<p className="pt-1 font-semibold text-sm">
							{format(serie.createdAt, "MMM d, yyyy")}
						</p>
					</div>
					<div
						title={format(serie.updatedAt, "dd.MM.yyyy, HH:mm")}
						className="border bg-background p-3"
					>
						<p className="font-bold text-[10px] text-muted-foreground uppercase">
							Last Update
						</p>
						<p className="pt-1 font-semibold text-sm">
							{format(serie.updatedAt, "MMM d, yyyy")}
						</p>
					</div>
				</div>

				{/* Admin Actions */}
				<div className="flex flex-wrap gap-2 pt-4">
					<EditSerieSheet
						slug={serie.slug}
						render={
							<Button variant="default" className="gap-2 rounded-none px-6">
								<Edit3 className="h-4 w-4" />
								Edit Series
							</Button>
						}
					/>
					<Button
						variant="outline"
						className="gap-2 rounded-none"
						render={
							<Link
								href={`/dashboard/author/series/${serie.slug}/books/create`}
							/>
						}
					>
						<Plus className="h-4 w-4" />
						Add Book
					</Button>
				</div>
			</div>
		</div>
	);
}

export function SerieHeaderLoading() {
	return (
		<div className="flex w-full flex-col gap-8 border-b bg-muted/30 px-6 py-8">
			<div className="flex-1 space-y-4">
				{/* Meta Information Skeletons */}
				<div className="flex items-center gap-3">
					<Skeleton className="h-5 w-16 rounded-none" /> {/* Status Badge */}
					<div className="border-l pl-3">
						<Skeleton className="h-4 w-24 rounded-none" /> {/* Visibility */}
					</div>
				</div>

				{/* Title and Slug Skeletons */}
				<div className="space-y-2">
					<Skeleton className="h-10 w-1/3 rounded-none" /> {/* Title */}
					<Skeleton className="h-4 w-48 rounded-none" /> {/* Slug */}
				</div>

				{/* Dashboard Stats Grid Skeletons */}
				<div className="grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="space-y-2 border bg-background p-3">
							<Skeleton className="h-3 w-12 rounded-none" /> {/* Label */}
							<Skeleton className="h-7 w-16 rounded-none" /> {/* Value */}
						</div>
					))}
				</div>

				{/* Admin Actions Skeletons */}
				<div className="flex flex-wrap gap-2 pt-4">
					<Skeleton className="h-10 w-32 rounded-none" /> {/* Edit Button */}
					<Skeleton className="h-10 w-28 rounded-none" /> {/* Add Button */}
					<Skeleton className="h-10 w-28 rounded-none" />{" "}
					{/* Analytics Button */}
					<Skeleton className="h-10 w-10 rounded-none" /> {/* Settings Icon */}
				</div>
			</div>
		</div>
	);
}

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { AuthorGetChaptersListOutputType } from "@encre/schemas";
import { formatEnum } from "@encre/utils";
import { format } from "date-fns";
import {
	CalendarDays,
	EyeIcon,
	GripVertical,
	Heart,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChapterCardProps {
	chapter: AuthorGetChaptersListOutputType[number];
	isDragging?: boolean;
}

export function ChapterCard({ chapter, isDragging = false }: ChapterCardProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging: isSortableDragging,
	} = useSortable({ id: chapter.slug });
	const { serieSlug, bookSlug } = useParams() as {
		serieSlug: string;
		bookSlug: string;
	};

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const isCurrentlyDragging = isDragging || isSortableDragging;

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"group relative flex items-center gap-4 rounded-none border bg-background p-4 transition-colors hover:bg-muted/50",
				isCurrentlyDragging &&
					"cursor-grabbing border-primary border-dashed opacity-50",
			)}
		>
			{/* Drag Handle & Order */}
			<div className="flex shrink-0 items-center gap-2">
				<button
					type="button"
					className="cursor-grab touch-none active:cursor-grabbing"
					{...attributes}
					{...listeners}
				>
					<GripVertical className="h-5 w-5 text-muted-foreground/30 group-hover:text-muted-foreground/60" />
				</button>
				<div className="flex h-8 w-8 items-center justify-center border bg-muted font-bold font-mono text-xs">
					{chapter.order}
				</div>
			</div>

			{/* Book Content */}
			<div className="grid min-w-0 flex-1 grid-cols-1 items-center gap-4 md:grid-cols-12">
				{/* Title & Slug Section */}
				<div className="space-y-1 md:col-span-4">
					<div className="flex items-center gap-2">
						<h3 className="truncate font-bold uppercase tracking-tight">
							{chapter.title}
						</h3>
						<Badge variant="outline">{formatEnum(chapter.status)}</Badge>
					</div>
					<p className="truncate font-mono text-muted-foreground text-xs">
						/{chapter.slug}
					</p>
				</div>

				{/* Stats Section */}
				<div className="flex items-center gap-4 md:col-span-4">
					<div
						className="flex items-center gap-1.5 text-muted-foreground text-xs"
						title="Likes"
					>
						<Heart className="h-3.5 w-3.5" />
						<span className="font-medium">
							{chapter._count.likes.toLocaleString()}
						</span>
					</div>
					<div
						className="flex items-center gap-1.5 text-muted-foreground text-xs"
						title="Reads"
					>
						<Users className="h-3.5 w-3.5" />
						<span className="font-medium">
							{chapter._count.reads.toLocaleString()}
						</span>
					</div>
					<div
						className="flex items-center gap-1.5 text-muted-foreground text-xs"
						title="Shelved"
					>
						<EyeIcon className="h-3.5 w-3.5" />
						<span className="font-medium">
							{chapter.views.toLocaleString()}
						</span>
					</div>
				</div>

				{/* Dates Section */}
				<div className="flex items-center gap-6 md:col-span-4 md:justify-end">
					<div className="flex flex-col items-start gap-0.5 md:items-end">
						<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
							<CalendarDays className="h-3 w-3" />
							<span>{format(chapter.createdAt, "MMM d, yyyy")}</span>
						</div>
						<span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
							Created
						</span>
					</div>
					<div className="flex flex-col items-start gap-0.5 md:items-end">
						<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
							<CalendarDays className="h-3 w-3" />
							<span>{format(chapter.updatedAt, "MMM d, yyyy")}</span>
						</div>
						<span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
							Updated
						</span>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="ml-4 flex shrink-0 items-center gap-1">
				{/* <EditBookSheet
					slug={book.slug}
					serieSlug={serieSlug}
					render={
						<Button
							variant="ghost"
							size="icon"
							className="hidden rounded-none sm:flex"
						>
							<Pencil className="h-4 w-4" />
						</Button>
					}
				/> */}

				<Button
					variant="ghost"
					size="icon"
					className="rounded-none"
					render={
						<Link
							href={`/dashboard/author/series/${serieSlug}/books/${bookSlug}/chapters/${chapter.slug}`}
						/>
					}
				>
					<EyeIcon />
				</Button>
			</div>
		</div>
	);
}

export function ChapterCardLoading() {
	return (
		<div className="group relative flex items-center gap-4 rounded-none border bg-background p-4 transition-colors hover:bg-muted/50">
			{/* Drag Handle & Order */}
			<div className="flex shrink-0 items-center gap-2">
				<GripVertical className="h-5 w-5 text-muted-foreground/30" />
				<div className="flex h-8 w-8 items-center justify-center border bg-muted font-bold font-mono text-xs">
					<Skeleton className="h-4 w-4" />
				</div>
			</div>

			{/* Book Content */}
			<div className="grid min-w-0 flex-1 grid-cols-1 items-center gap-4 md:grid-cols-12">
				{/* Title & Slug Section */}
				<div className="space-y-1 md:col-span-4">
					<div className="flex items-center gap-2">
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-5 w-16" />
					</div>
					<Skeleton className="h-4 w-24" />
				</div>

				{/* Stats Section */}
				<div className="flex items-center gap-4 md:col-span-4">
					<Skeleton className="h-4 w-12" />
					<Skeleton className="h-4 w-12" />
					<Skeleton className="h-4 w-12" />
				</div>

				{/* Dates Section */}
				<div className="flex items-center gap-6 md:col-span-4 md:justify-end">
					<div className="flex flex-col items-end gap-0.5">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-3 w-12" />
					</div>
					<div className="flex flex-col items-end gap-0.5">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-3 w-12" />
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="ml-4 flex shrink-0 items-center gap-1">
				<Skeleton className="h-8 w-8" />
			</div>
		</div>
	);
}

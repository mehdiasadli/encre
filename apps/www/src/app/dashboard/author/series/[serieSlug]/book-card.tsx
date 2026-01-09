import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { AuthorGetBooksListOutputType } from "@encre/schemas";
import { formatEnum } from "@encre/utils";
import { format } from "date-fns";
import {
	BookMarked,
	BookOpen,
	CalendarDays,
	Eye,
	FileText,
	GripVertical,
	Heart,
	MoreHorizontal,
	Pencil,
	Trash2,
	Users,
} from "lucide-react";
import { EditBookSheet } from "@/components/edit-book-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Menu,
	MenuGroup,
	MenuGroupLabel,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from "@/components/ui/menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BookCardProps {
	book: AuthorGetBooksListOutputType[number];
	serieSlug: string;
	isDragging?: boolean;
}

export function BookCard({
	book,
	serieSlug,
	isDragging = false,
}: BookCardProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging: isSortableDragging,
	} = useSortable({ id: book.slug });

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
					{book.order}
				</div>
			</div>

			{/* Book Content */}
			<div className="grid min-w-0 flex-1 grid-cols-1 items-center gap-4 md:grid-cols-12">
				{/* Title & Slug Section */}
				<div className="space-y-1 md:col-span-4">
					<div className="flex items-center gap-2">
						<h3 className="truncate font-bold uppercase tracking-tight">
							{book.title}
						</h3>
						<Badge variant="outline">{formatEnum(book.status)}</Badge>
					</div>
					<p className="truncate font-mono text-muted-foreground text-xs">
						/{book.slug}
					</p>
				</div>

				{/* Stats Section */}
				<div className="flex items-center gap-4 md:col-span-4">
					<div
						className="flex items-center gap-1.5 text-muted-foreground text-xs"
						title="Chapters"
					>
						<BookOpen className="h-3.5 w-3.5" />
						<span className="font-medium">{book._count.chapters}</span>
					</div>
					<div
						className="flex items-center gap-1.5 text-muted-foreground text-xs"
						title="Likes"
					>
						<Heart className="h-3.5 w-3.5" />
						<span className="font-medium">
							{book._count.likes.toLocaleString()}
						</span>
					</div>
					<div
						className="flex items-center gap-1.5 text-muted-foreground text-xs"
						title="Reads"
					>
						<Users className="h-3.5 w-3.5" />
						<span className="font-medium">
							{book._count.reads.toLocaleString()}
						</span>
					</div>
					<div
						className="flex items-center gap-1.5 text-muted-foreground text-xs"
						title="Shelved"
					>
						<BookMarked className="h-3.5 w-3.5" />
						<span className="font-medium">
							{book._count.shelves.toLocaleString()}
						</span>
					</div>
				</div>

				{/* Dates Section */}
				<div className="flex items-center gap-6 md:col-span-4 md:justify-end">
					<div className="flex flex-col items-start gap-0.5 md:items-end">
						<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
							<CalendarDays className="h-3 w-3" />
							<span>{format(book.createdAt, "MMM d, yyyy")}</span>
						</div>
						<span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
							Created
						</span>
					</div>
					<div className="flex flex-col items-start gap-0.5 md:items-end">
						<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
							<CalendarDays className="h-3 w-3" />
							<span>{format(book.updatedAt, "MMM d, yyyy")}</span>
						</div>
						<span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
							Updated
						</span>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="ml-4 flex shrink-0 items-center gap-1">
				<EditBookSheet
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
				/>

				<Menu>
					<MenuTrigger
						render={
							<Button variant="ghost" size="icon" className="rounded-none" />
						}
					>
						<MoreHorizontal className="h-4 w-4" />
					</MenuTrigger>
					<MenuPopup align="end" className="rounded-none">
						<MenuGroup>
							<MenuGroupLabel>Actions</MenuGroupLabel>
							<MenuItem className="rounded-none">
								<Eye className="mr-2 h-4 w-4" /> View Chapters
							</MenuItem>
							<MenuItem className="rounded-none">
								<FileText className="mr-2 h-4 w-4" /> Book Settings
							</MenuItem>
							<MenuSeparator className="rounded-none" />
							<MenuItem className="rounded-none text-destructive focus:text-destructive">
								<Trash2 className="mr-2 h-4 w-4" /> Delete Book
							</MenuItem>
						</MenuGroup>
					</MenuPopup>
				</Menu>
			</div>
		</div>
	);
}

export function BookCardLoading() {
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
				<Skeleton className="h-8 w-8" />
			</div>
		</div>
	);
}

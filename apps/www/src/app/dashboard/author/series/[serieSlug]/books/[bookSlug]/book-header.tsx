"use client";
import type { AuthorGetBookOutputType } from "@encre/schemas";
import { formatEnum } from "@encre/utils";
import { format } from "date-fns";
import { Edit3, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DeleteResourceDialog } from "@/components/delete-resource-dialog";
import { EditBookSheet } from "@/components/edit-book-sheet";
import { EditResourceStatusSheet } from "@/components/edit-resource-status-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function BookHeader({ book }: { book: AuthorGetBookOutputType }) {
	const { serieSlug } = useParams() as { serieSlug: string };

	return (
		<div className="flex w-full flex-col gap-8 border-b bg-muted/30 px-6 py-8">
			<div className="flex-1 space-y-4">
				<div className="flex flex-wrap items-center gap-3">
					<EditResourceStatusSheet
						initialStatus={book.status}
						slug={book.slug}
						render={
							<Badge className="cursor-pointer" variant="outline">
								{formatEnum(book.status)}
							</Badge>
						}
						type="book"
					/>

					<DeleteResourceDialog
						slug={book.slug}
						title={book.title}
						type="book"
						render={
							<Button variant="destructive" size="sm" className="ml-auto">
								<Trash className="h-4 w-4" />
								Delete
							</Button>
						}
					/>
				</div>

				<div className="space-y-1">
					<h1 className="font-bold text-3xl tracking-tight">{book.title}</h1>
					<p className="text-muted-foreground text-sm">
						Book Slug: <code className="bg-muted px-1 py-0.5">{book.slug}</code>
					</p>
				</div>

				{/* Dashboard Stats Grid */}
				<div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
					<div className="border bg-background p-3">
						<p className="font-bold text-[10px] text-muted-foreground uppercase">
							Chapters
						</p>
						<p className="font-semibold text-xl">{book._count.chapters}</p>
					</div>
					<div className="border bg-background p-3">
						<p className="font-bold text-[10px] text-muted-foreground uppercase">
							Total Likes
						</p>
						<p className="font-semibold text-xl">
							{book._count.likes.toLocaleString()}
						</p>
					</div>
					<div className="border bg-background p-3">
						<p className="font-bold text-[10px] text-muted-foreground uppercase">
							Total Reads
						</p>
						<p className="font-semibold text-xl">
							{book._count.reads.toLocaleString()}
						</p>
					</div>
					<div className="border bg-background p-3">
						<p className="font-bold text-[10px] text-muted-foreground uppercase">
							Shelves Added
						</p>
						<p className="font-semibold text-xl">
							{book._count.shelves.toLocaleString()}
						</p>
					</div>
					<div
						title={format(book.createdAt, "dd.MM.yyyy, HH:mm")}
						className="border bg-background p-3"
					>
						<p className="font-bold text-[10px] text-muted-foreground uppercase">
							Created At
						</p>
						<p className="pt-1 font-semibold text-sm">
							{format(book.createdAt, "MMM d, yyyy")}
						</p>
					</div>
					<div
						title={format(book.updatedAt, "dd.MM.yyyy, HH:mm")}
						className="border bg-background p-3"
					>
						<p className="font-bold text-[10px] text-muted-foreground uppercase">
							Last Update
						</p>
						<p className="pt-1 font-semibold text-sm">
							{format(book.updatedAt, "MMM d, yyyy")}
						</p>
					</div>
				</div>

				{/* Admin Actions */}
				<div className="flex flex-wrap gap-2 pt-4">
					<EditBookSheet
						slug={book.slug}
						serieSlug={serieSlug}
						render={
							<Button variant="default" className="gap-2 rounded-none px-6">
								<Edit3 className="h-4 w-4" />
								Edit Book
							</Button>
						}
					/>
					<Button
						variant="outline"
						className="gap-2 rounded-none"
						render={
							<Link
								href={`/dashboard/author/series/${serieSlug}/books/${book.slug}/chapters/create`}
							/>
						}
					>
						<Plus className="h-4 w-4" />
						Add Chapter
					</Button>
				</div>
			</div>
		</div>
	);
}

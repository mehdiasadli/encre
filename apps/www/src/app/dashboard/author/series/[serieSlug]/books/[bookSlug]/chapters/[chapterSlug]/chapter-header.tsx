"use client";

import type { AuthorGetChapterOutputType } from "@encre/schemas";
import { formatEnum } from "@encre/utils";
import { format } from "date-fns";
import { BookOpen, Edit3, PencilIcon, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DeleteResourceDialog } from "@/components/delete-resource-dialog";
import { EditChapterSheet } from "@/components/edit-chapter-sheet";
import { EditResourceStatusSheet } from "@/components/edit-resource-status-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ChapterHeader({
	chapter,
}: {
	chapter: AuthorGetChapterOutputType;
}) {
	const { serieSlug, bookSlug } = useParams() as {
		serieSlug: string;
		bookSlug: string;
	};

	return (
		<div className="flex w-full flex-col gap-8 border-b bg-muted/30 px-6 py-8">
			<div className="flex-1 space-y-4">
				<div className="flex flex-wrap items-center gap-3">
					<EditResourceStatusSheet
						initialStatus={chapter.status}
						slug={chapter.slug}
						render={
							<Badge className="cursor-pointer" variant="outline">
								{formatEnum(chapter.status)}
							</Badge>
						}
						type="chapter"
					/>

					<DeleteResourceDialog
						slug={chapter.slug}
						title={chapter.title}
						type="chapter"
						render={
							<Button variant="destructive" size="sm" className="ml-auto">
								<Trash className="h-4 w-4" />
								Delete
							</Button>
						}
					/>
				</div>

				<div className="space-y-1">
					<h1 className="font-bold text-3xl tracking-tight">{chapter.title}</h1>
					<p className="text-muted-foreground text-sm">
						Chapter Slug:{" "}
						<code className="bg-muted px-1 py-0.5">{chapter.slug}</code>
					</p>
				</div>

				{/* Dashboard Stats Grid */}
				<div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
					<div className="border bg-background p-3">
						<p className="font-bold text-[10px] text-muted-foreground uppercase">
							Total Likes
						</p>
						<p className="font-semibold text-xl">
							{chapter._count.likes.toLocaleString()}
						</p>
					</div>
					<div className="border bg-background p-3">
						<p className="font-bold text-[10px] text-muted-foreground uppercase">
							Total Reads
						</p>
						<p className="font-semibold text-xl">
							{chapter._count.reads.toLocaleString()}
						</p>
					</div>
					<div className="border bg-background p-3">
						<p className="font-bold text-[10px] text-muted-foreground uppercase">
							Total Views
						</p>
						<p className="font-semibold text-xl">
							{chapter.views.toLocaleString()}
						</p>
					</div>
					<div
						title={format(chapter.createdAt, "dd.MM.yyyy, HH:mm")}
						className="border bg-background p-3"
					>
						<p className="font-bold text-[10px] text-muted-foreground uppercase">
							Created At
						</p>
						<p className="pt-1 font-semibold text-sm">
							{format(chapter.createdAt, "MMM d, yyyy")}
						</p>
					</div>
					<div
						title={format(chapter.updatedAt, "dd.MM.yyyy, HH:mm")}
						className="border bg-background p-3"
					>
						<p className="font-bold text-[10px] text-muted-foreground uppercase">
							Last Update
						</p>
						<p className="pt-1 font-semibold text-sm">
							{format(chapter.updatedAt, "MMM d, yyyy")}
						</p>
					</div>
				</div>

				{/* Admin Actions */}
				<div className="flex flex-wrap gap-2 pt-4">
					<EditChapterSheet
						slug={chapter.slug}
						bookSlug={bookSlug}
						render={
							<Button variant="default" className="gap-2 rounded-none px-6">
								<Edit3 className="h-4 w-4" />
								Edit Chapter
							</Button>
						}
					/>
					<Button
						variant="outline"
						className="gap-2 rounded-none"
						render={
							<Link
								href={`/dashboard/author/series/${serieSlug}/books/${bookSlug}/chapters/${chapter.slug}/edit/content`}
							/>
						}
					>
						<BookOpen className="h-4 w-4" />
						Edit Story
					</Button>
				</div>
			</div>
		</div>
	);
}

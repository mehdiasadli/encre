"use client";

import type { AuthorGetChapterOutputType } from "@encre/schemas";
import { format } from "date-fns";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ContentDisplay } from "@/components/content-display";
import { Button } from "@/components/ui/button";
import {
	Frame,
	FrameFooter,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from "@/components/ui/frame";
import { useContent } from "@/hooks/use-content";
import { orpc } from "@/utils/orpc";

interface ChapterContentProps {
	chapter: AuthorGetChapterOutputType;
}

export function ChapterContent({ chapter }: ChapterContentProps) {
	const { serieSlug, bookSlug } = useParams<{
		serieSlug: string;
		bookSlug: string;
	}>();
	const { content } = useContent({
		...orpc.chapters.authorGetChapterContent.queryOptions({
			input: { slug: chapter.slug },
		}),
		enabled: !!chapter.slug,
	});

	return content((data) => (
		<Frame>
			<FrameHeader className="flex flex-row items-center justify-between">
				<FrameTitle>Content of {chapter.title}</FrameTitle>
				<div className="flex flex-row items-center gap-2 text-muted-foreground text-sm">
					<p>{data.words} words</p>
					<p>•</p>
					<p>
						{data.editedAt
							? `Edited on ${format(data.editedAt, "dd.MM.yyyy")}`
							: "Never edited"}
					</p>
					<p>•</p>
					<p>
						{data.publishedAt
							? `Published on ${format(data.publishedAt, "dd.MM.yyyy")}`
							: "Never published"}
					</p>
					{data.publishedAt && (
						<>
							<p>•</p>
							<p>
								{data.lastPublishedAt
									? `Last published on ${format(data.lastPublishedAt, "dd.MM.yyyy")}`
									: "Never published"}
							</p>
						</>
					)}
				</div>
			</FrameHeader>
			<FramePanel>
				<ContentDisplay
					content={data.content}
					emptyText="No content yet. Start writing your chapter content."
				/>
			</FramePanel>
			<FrameFooter>
				<Button
					className="ml-auto max-w-md"
					render={
						<Link
							href={`/dashboard/author/series/${serieSlug}/books/${bookSlug}/chapters/${chapter.slug}/edit/content`}
						/>
					}
				>
					<BookOpen />
					Edit Story
				</Button>
			</FrameFooter>
		</Frame>
	));
}

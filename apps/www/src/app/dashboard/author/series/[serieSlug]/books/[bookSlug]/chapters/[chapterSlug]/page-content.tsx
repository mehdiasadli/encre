"use client";

import { useContent } from "@/hooks/use-content";
import { orpc } from "@/utils/orpc";
import { ChapterContent } from "./chapter-content";
import { ChapterHeader } from "./chapter-header";

export function ChapterPageContent({ slug }: { slug: string }) {
	const { content } = useContent({
		...orpc.chapter.authorGetChapter.queryOptions({ input: { slug } }),
		enabled: !!slug,
	});

	return content((chapter) => (
		<div className="space-y-4">
			<ChapterHeader chapter={chapter} />
			<ChapterContent chapter={chapter} />
		</div>
	));
}

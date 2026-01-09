"use client";

import { useContent } from "@/hooks/use-content";
import { orpc } from "@/utils/orpc";
import { BookChapterlist } from "./book-chapterlist";
import { BookHeader } from "./book-header";

export function BookPageContent({ slug }: { slug: string }) {
	const { content } = useContent({
		...orpc.books.authorGetBook.queryOptions({ input: { slug } }),
		enabled: !!slug,
	});

	return content((book) => (
		<div className="space-y-4">
			<BookHeader book={book} />
			<BookChapterlist book={book} />
		</div>
	));
}

import { ChapterPageContent } from "./page-content";

export default async function ChapterPage({
	params,
}: PageProps<"/dashboard/author/series/[serieSlug]/books/[bookSlug]/chapters/[chapterSlug]">) {
	const { chapterSlug } = await params;
	return <ChapterPageContent slug={chapterSlug} />;
}

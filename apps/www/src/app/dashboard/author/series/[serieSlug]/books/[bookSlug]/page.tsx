import { BookPageContent } from "./page-content";

export default async function BookPage({
	params,
}: PageProps<"/dashboard/author/series/[serieSlug]/books/[bookSlug]">) {
	const { bookSlug } = await params;
	return <BookPageContent slug={bookSlug} />;
}

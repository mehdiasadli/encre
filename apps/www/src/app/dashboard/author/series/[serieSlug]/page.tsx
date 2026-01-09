import { SeriePageContent } from "./page-content";

export default async function SeriePage({
	params,
}: PageProps<"/dashboard/author/series/[serieSlug]">) {
	const { serieSlug } = await params;
	return <SeriePageContent slug={serieSlug} />;
}

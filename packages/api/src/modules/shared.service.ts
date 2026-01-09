import type { ResourceStatusType } from "@encre/schemas/models/inputTypeSchemas/ResourceStatusSchema";
import { resourceTitleBlocklist } from "@encre/utils";
import { ORPCError } from "@orpc/client";

export function validateResourceTitle(
	title: string,
	path: string[] = ["title"],
) {
	if (
		resourceTitleBlocklist.some(
			(w) => title.toLowerCase().trim() === w.toLowerCase().trim(),
		)
	) {
		throw new ORPCError("BAD_REQUEST", {
			message: "Title contains blocked words. Please choose a different title.",
			data: { path },
		});
	}
}

export async function validateAuthorResourceStatusUpdate(
	status: ResourceStatusType,
	newStatus: ResourceStatusType | undefined,
	onPublished?: () => Promise<void>,
	path: string[] = ["status"],
) {
	if (!newStatus || status === newStatus) return undefined;

	const statusMap: Record<
		Exclude<ResourceStatusType, "deleted">,
		Exclude<ResourceStatusType, "deleted">[]
	> = {
		draft: ["published", "coming_soon", "cancelled"],
		archived: ["published"],
		cancelled: ["archived"],
		coming_soon: ["published", "cancelled"],
		published: ["archived", "cancelled"],
	};

	if (!statusMap[newStatus as Exclude<ResourceStatusType, "deleted">]) {
		throw new ORPCError("BAD_REQUEST", {
			message: "Invalid status",
			data: { path },
		});
	}

	if (newStatus === "published" && onPublished) {
		await onPublished();
	}
}

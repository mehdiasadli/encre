"use client";

import { AlertTriangle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { useORPCMutation } from "@/hooks/use-orpc-mutation";
import { orpc } from "@/utils/orpc";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import {
	Dialog,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPopup,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { LoadingButton } from "./ui/loading-button";

export type DeleteResourceType = "serie" | "book" | "chapter" | "character";

interface DeleteResourceDialogProps {
	render?: React.ComponentProps<typeof DialogTrigger>["render"];
	slug: string;
	title: string;
	type: DeleteResourceType;
	description?: React.ReactNode;
}

export function DeleteResourceDialog({
	render,
	slug,
	title,
	type,
	description,
}: DeleteResourceDialogProps) {
	const router = useRouter();

	const { serieSlug, bookSlug } = useParams() as {
		serieSlug?: string;
		bookSlug?: string;
	};
	const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useQueryState(
		`${type}-delete`,
	);
	const [titleValue, setTitleValue] = useState("");

	const { mutate: deleteSerie, isPending: isSerieSubmitting } = useORPCMutation(
		{
			...orpc.series.deleteSerie.mutationOptions(),
			invalidateQueries: [orpc.series.authorGetManySerie.queryKey()],
			onSuccess() {
				toast.success("Resource deleted successfully");
				router.push("/dashboard/author");
			},
		},
	);

	const { mutate: deleteBook, isPending: isBookSubmitting } = useORPCMutation({
		...orpc.books.deleteBook.mutationOptions(),
		invalidateQueries: [
			orpc.books.authorGetBooksList.queryKey({
				input: { series: serieSlug ? [serieSlug] : undefined },
			}),
		],
		onSuccess() {
			toast.success("Resource deleted successfully");
			if (serieSlug) {
				router.push(`/dashboard/author/series/${serieSlug}`);
			} else {
				router.push("/dashboard/author");
			}
		},
	});

	const { mutate: deleteChapter, isPending: isChapterSubmitting } =
		useORPCMutation({
			...orpc.chapters.deleteChapter.mutationOptions(),
			invalidateQueries: [
				orpc.chapters.authorGetChaptersList.queryKey({
					input: { books: bookSlug ? [bookSlug] : undefined },
				}),
			],
			onSuccess() {
				toast.success("Resource deleted successfully");
				if (serieSlug && bookSlug) {
					router.push(
						`/dashboard/author/series/${serieSlug}/books/${bookSlug}`,
					);
				} else if (serieSlug) {
					router.push(`/dashboard/author/series/${serieSlug}`);
				} else {
					router.push("/dashboard/author");
				}
			},
		});

	const onSubmit = () => {
		switch (type) {
			case "serie":
				deleteSerie({ slug, title: titleValue });
				break;
			case "chapter":
				deleteChapter({ slug, title: titleValue });
				break;
			case "book":
				deleteBook({ slug, title: titleValue });
				break;
			default:
				toast.error("Invalid resource type");
				break;
		}
	};

	return (
		<Dialog
			open={isAcceptDialogOpen === slug}
			onOpenChange={(open) => setIsAcceptDialogOpen(open ? slug : null)}
		>
			<DialogTrigger render={render} />
			<DialogPopup
				onCopy={(e) => e.preventDefault()}
				onPaste={(e) => e.preventDefault()}
				onCut={(e) => e.preventDefault()}
				onSelect={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>Delete &quot;{title}&quot;?</DialogTitle>
					<DialogDescription>
						{description || (
							<>
								This will permanently delete{" "}
								<span className="font-semibold">&quot;{title}&quot;</span>. This
								action cannot be undone.
							</>
						)}
					</DialogDescription>
				</DialogHeader>
				<Card className="mx-4 mb-4 border-destructive bg-destructive/10">
					<CardHeader>
						<CardTitle className="text-destructive">Confirm deletion</CardTitle>
						<CardDescription>
							Type{" "}
							<span className="select-none font-semibold">
								&quot;{title}&quot;
							</span>{" "}
							below to confirm.
						</CardDescription>
					</CardHeader>
					<CardContent className="text-destructive">
						<InputGroup>
							<InputGroupInput
								id="title"
								placeholder="Enter the title"
								value={titleValue}
								onChange={(e) => setTitleValue(e.target.value)}
								onPaste={(e) => e.preventDefault()}
								onDrop={(e) => e.preventDefault()}
							/>
							<InputGroupAddon align="inline-start">
								<AlertTriangle />
							</InputGroupAddon>
						</InputGroup>
					</CardContent>
				</Card>
				<DialogFooter>
					<LoadingButton
						disabled={titleValue !== title}
						isLoading={
							isSerieSubmitting || isBookSubmitting || isChapterSubmitting
						}
						loadingText="Deleting..."
						onClick={onSubmit}
						variant="destructive"
					>
						Confirm
					</LoadingButton>
				</DialogFooter>
			</DialogPopup>
		</Dialog>
	);
}

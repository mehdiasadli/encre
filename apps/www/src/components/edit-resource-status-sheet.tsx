"use client";

import { ResourceStatusSchema } from "@encre/schemas";
import type { ResourceStatusType } from "@encre/schemas/models/inputTypeSchemas/ResourceStatusSchema";
import { formatEnum, formatEnumForOptions } from "@encre/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useORPCMutation } from "@/hooks/use-orpc-mutation";
import { orpc } from "@/utils/orpc";
import { FormInput } from "./form-input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPopup,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { LoadingButton } from "./ui/loading-button";
import { Radio, RadioGroup } from "./ui/radio-group";
import {
	Sheet,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetPanel,
	SheetPopup,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";

export type StatusResourceType = "serie" | "book" | "chapter";

interface EditResourceStatusSheetProps {
	render?: React.ComponentProps<typeof SheetTrigger>["render"];
	slug: string;
	initialStatus: Exclude<ResourceStatusType, "deleted">;
	type: StatusResourceType;
}

const authorResourceStatusAllowance: Record<
	Exclude<ResourceStatusType, "deleted">,
	Exclude<ResourceStatusType, "deleted">[]
> = {
	draft: ["coming_soon", "published"],
	coming_soon: ["cancelled", "published", "archived"],
	cancelled: [],
	archived: ["published", "cancelled"],
	published: ["archived", "cancelled"],
};

export function EditResourceStatusSheet({
	render,
	initialStatus,
	slug,
	type,
}: EditResourceStatusSheetProps) {
	const { serieSlug, bookSlug } = useParams() as {
		serieSlug?: string;
		bookSlug?: string;
	};
	const [isOpen, setIsOpen] = useQueryState(`edit-${type}-status`);
	const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useQueryState(
		`accept-${type}-status`,
	);

	const { mutate: updateSerie, isPending: isSerieSubmitting } = useORPCMutation(
		{
			...orpc.serie.updateSerie.mutationOptions(),
			invalidateQueries: [
				orpc.serie.authorGetOneSerie.queryKey({ input: { slug } }),
				orpc.serie.authorGetManySerie.queryKey(),
			],
			onSuccess() {
				toast.success("Status updated successfully");
				onOpenChange(false);
				setIsAcceptDialogOpen(null);
			},
		},
	);

	const { mutate: updateBook, isPending: isBookSubmitting } = useORPCMutation({
		...orpc.books.updateBook.mutationOptions(),
		invalidateQueries: [
			orpc.books.authorGetBook.queryKey({ input: { slug } }),
			orpc.books.authorGetBooksList.queryKey({
				input: { series: serieSlug ? [serieSlug] : undefined },
			}),
		],
		onSuccess() {
			toast.success("Status updated successfully");
			onOpenChange(false);
			setIsAcceptDialogOpen(null);
		},
	});

	const { mutate: updateChapter, isPending: isChapterSubmitting } =
		useORPCMutation({
			...orpc.chapter.updateChapter.mutationOptions(),
			invalidateQueries: [
				orpc.chapter.authorGetChapter.queryKey({ input: { slug } }),
				orpc.chapter.authorGetChaptersList.queryKey({
					input: { books: bookSlug ? [bookSlug] : undefined },
				}),
			],
			onSuccess() {
				toast.success("Status updated successfully");
				onOpenChange(false);
				setIsAcceptDialogOpen(null);
			},
		});

	const form = useForm({
		defaultValues: {
			status: initialStatus,
		},
		resolver: zodResolver(
			z
				.object({
					status: ResourceStatusSchema.exclude(["deleted"]).optional(),
				})
				.refine(
					(data) => {
						if (!data.status) return true;

						const allowance = authorResourceStatusAllowance[initialStatus];

						if (!allowance) return false;

						return allowance.includes(data.status);
					},
					{
						error: "You are not allowed to change the status to this status",
						path: ["status"],
					},
				),
		),
	});

	const onSubmit = form.handleSubmit((data) => {
		switch (type) {
			case "serie":
				updateSerie({ slug, status: data.status });
				break;
			case "book":
				updateBook({ slug, status: data.status });
				break;
			case "chapter":
				updateChapter({ slug, status: data.status });
				break;
			default:
				toast.error("Invalid resource type");
				break;
		}
	});

	const onOpenChange = (open: boolean) => {
		if (!open) {
			form.reset();
		}

		setIsOpen(open ? slug : null);
	};

	return (
		<Sheet open={isOpen === slug} onOpenChange={onOpenChange}>
			{render && <SheetTrigger nativeButton={false} render={render} />}
			<SheetPopup render={<form onSubmit={onSubmit} />} showCloseButton={false}>
				<SheetHeader>
					<SheetTitle>Edit Status</SheetTitle>
					<SheetDescription>
						Edit the status of the resource. The status determines if the
						resource is published, not published, cancelled etc.
					</SheetDescription>
					<Badge size="lg" variant="outline">
						Current status: {formatEnum(initialStatus)}
					</Badge>
				</SheetHeader>
				<SheetPanel>
					<FormInput
						control={form.control}
						name="status"
						render={({ onChange: onValueChange, ...field }) => (
							<RadioGroup {...field} onValueChange={onValueChange}>
								{formatEnumForOptions(ResourceStatusSchema.options, {
									archived:
										"The resource is archived and no longer published. It cannot be read by anyone until re-published again.",
									cancelled:
										"The resource is cancelled. It can still be read, but author cannot continue working on it anymore.",
									coming_soon:
										"The resource's content is not yet ready to be published, but people can see the basic information about it.",
									deleted:
										"The resource is deleted and no longer exists. It cannot be read by anyone.",
									draft:
										"The resource is a draft. It is not published yet and can only be read by the author.",
									published:
										"The resource is published and can be read by anyone (depends on visibility settins).",
								}).map((item) => {
									const allowance =
										authorResourceStatusAllowance[initialStatus];

									if (!allowance) return null;

									if (
										!allowance.includes(
											item.value as Exclude<ResourceStatusType, "deleted">,
										)
									)
										return null;

									return (
										<Label
											key={item.value}
											htmlFor={`${field.name}-${item.value}`}
											className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50"
										>
											<Radio
												id={`${field.name}-${item.value}`}
												value={item.value}
											/>
											<div className="flex flex-col gap-1">
												<p>{item.label}</p>
												<p className="text-muted-foreground text-xs">
													{item.description}
												</p>
											</div>
										</Label>
									);
								})}
							</RadioGroup>
						)}
					/>
				</SheetPanel>
				<SheetFooter>
					<Dialog
						open={isAcceptDialogOpen === slug}
						onOpenChange={(open) => setIsAcceptDialogOpen(open ? slug : null)}
					>
						<DialogTrigger
							render={
								<Button disabled={!form.formState.isValid} type="button" />
							}
						>
							Update Status
						</DialogTrigger>
						<DialogPopup>
							<DialogHeader>
								<DialogTitle>
									Are you sure you want to update the status?
								</DialogTitle>
								<DialogDescription>
									The status will be updated from {formatEnum(initialStatus)} to{" "}
									{formatEnum(form.watch("status"))}. This will affect the
									visibility and reachability of the resource. Some statuses may
									not be allowed to be changed to others.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<LoadingButton
									disabled={!form.formState.isValid}
									isLoading={
										isSerieSubmitting || isBookSubmitting || isChapterSubmitting
									}
									loadingText="Updating..."
									onClick={onSubmit}
								>
									Confirm
								</LoadingButton>
							</DialogFooter>
						</DialogPopup>
					</Dialog>
				</SheetFooter>
			</SheetPopup>
		</Sheet>
	);
}

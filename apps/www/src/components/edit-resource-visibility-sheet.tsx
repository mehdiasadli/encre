"use client";

import { ResourceVisibilitySchema } from "@encre/schemas";
import type { ResourceVisibilityType } from "@encre/schemas/models/inputTypeSchemas/ResourceVisibilitySchema";
import { formatEnum, formatEnumForOptions } from "@encre/utils";
import { zodResolver } from "@hookform/resolvers/zod";
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

export type VisibilityResourceType = "serie";

interface EditResourceVisibilitySheetProps {
	render?: React.ComponentProps<typeof SheetTrigger>["render"];
	slug: string;
	initialVisibility: ResourceVisibilityType;
	type?: VisibilityResourceType;
}

export function EditResourceVisibilitySheet({
	render,
	initialVisibility,
	slug,
	type = "serie",
}: EditResourceVisibilitySheetProps) {
	const [isOpen, setIsOpen] = useQueryState(`edit-${type}-visibility`);
	const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useQueryState(
		`accept-${type}-visibility`,
	);

	const { mutate: updateSerie, isPending: isSubmitting } = useORPCMutation({
		...orpc.series.updateSerie.mutationOptions(),
		invalidateQueries: [
			orpc.series.authorGetOneSerie.queryKey({ input: { slug } }),
			orpc.series.authorGetManySerie.queryKey(),
		],
		onSuccess() {
			toast.success("Visibility updated successfully");
			onOpenChange(false);
			setIsAcceptDialogOpen(null);
		},
	});

	const form = useForm({
		defaultValues: {
			visibility: initialVisibility,
		},
		resolver: zodResolver(
			z.object({
				visibility: ResourceVisibilitySchema.optional(),
			}),
		),
	});

	const onSubmit = form.handleSubmit((data) => {
		switch (type) {
			case "serie":
				updateSerie({
					slug,
					visibility: data.visibility,
				});
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
					<SheetTitle>Edit Visibility</SheetTitle>
					<SheetDescription>
						Edit the visibility of the series. Different visibility makes it
						possible to share the serie with different people.
					</SheetDescription>
					<Badge size="lg" variant="outline">
						Current status: {formatEnum(initialVisibility)}
					</Badge>
				</SheetHeader>
				<SheetPanel>
					<FormInput
						control={form.control}
						name="visibility"
						render={({ onChange: onValueChange, ...field }) => (
							<RadioGroup {...field} onValueChange={onValueChange}>
								{formatEnumForOptions(ResourceVisibilitySchema.options, {
									public:
										"On public visibility, the serie is visible to everyone.",
									private:
										"On private visibility, only the author can see the serie.",
									members:
										"On members visibility, only authorized users can see the serie.",
									followers:
										"On followers visibility, only followers of the author can see the serie.",
									unlisted:
										"On unlisted visibility, the serie is visible only with a link and is not searchable.",
								}).map((item) => (
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
								))}
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
							Update Visibility
						</DialogTrigger>
						<DialogPopup>
							<DialogHeader>
								<DialogTitle>
									Are you sure you want to update the visibility?
								</DialogTitle>
								<DialogDescription>
									The visibility will be updated from{" "}
									{formatEnum(initialVisibility)} to{" "}
									{formatEnum(form.watch("visibility"))}. This will affect the
									visibility of the resource.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<LoadingButton
									disabled={!form.formState.isValid}
									isLoading={isSubmitting}
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

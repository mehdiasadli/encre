"use client";

import { UpdateSerieInputSchema } from "@encre/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useContent } from "@/hooks/use-content";
import { useInitializeForm } from "@/hooks/use-initialize-form";
import { useORPCMutation } from "@/hooks/use-orpc-mutation";
import { orpc } from "@/utils/orpc";
import { FormInput } from "./form-input";
import {
	InputGroup,
	InputGroupInput,
	InputGroupTextarea,
} from "./ui/input-group";
import { LoadingButton } from "./ui/loading-button";
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

interface EditSerieSheetProps {
	render?: React.ComponentProps<typeof SheetTrigger>["render"];
	slug: string;
}

export function EditSerieSheet({ render, slug }: EditSerieSheetProps) {
	const [isOpen, setIsOpen] = useQueryState("edit-serie");
	const router = useRouter();
	const pathname = usePathname();

	const { content, data: serie } = useContent({
		...orpc.series.authorGetOneSerie.queryOptions({ input: { slug } }),
		enabled: isOpen === slug,
	});

	const form = useForm({
		resolver: zodResolver(
			UpdateSerieInputSchema.omit({
				slug: true,
				status: true,
				visibility: true,
			}),
		),
		defaultValues: {
			title: "",
			description: "",
		},
		resetOptions: {
			keepDirtyValues: true,
		},
	});
	const formInitialized = useInitializeForm(form, serie);

	const { mutate: updateSerie, isPending: isSubmitting } = useORPCMutation({
		...orpc.series.updateSerie.mutationOptions(),
		invalidateQueries: [orpc.series.authorGetManySerie.queryKey()],
		showErrorToast: false,
		onError(error) {
			if (error.data?.path?.includes("title")) {
				form.setError(
					"title",
					{ message: error.message },
					{ shouldFocus: true },
				);
			} else {
				toast.error(error.message ?? "An unknown error occurred");
			}
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		if (!formInitialized) return;
		updateSerie(
			{ slug, ...data },
			{
				onSuccess(data) {
					toast.success("Serie updated successfully");
					// Check if slug changed - if so, redirect; otherwise just close the sheet
					if (data.slug !== slug) {
						const newPathname = pathname.replace(slug, data.slug);
						router.push(newPathname as Route);
						router.refresh();
					} else {
						setIsOpen(null);
					}
				},
			},
		);
	});

	return (
		<Sheet
			open={isOpen === slug}
			onOpenChange={(open) => setIsOpen(open ? slug : null)}
		>
			<SheetTrigger render={render} />
			<SheetPopup render={<form onSubmit={onSubmit} />} showCloseButton={false}>
				<SheetHeader>
					<SheetTitle>Edit Serie</SheetTitle>
					<SheetDescription>Edit the serie details.</SheetDescription>
				</SheetHeader>
				<SheetPanel>
					{content(() => (
						<div className="space-y-4">
							<FormInput
								control={form.control}
								name="title"
								label="Title"
								render={(field) => (
									<InputGroup>
										<InputGroupInput
											disabled={!formInitialized}
											id={field.name}
											{...field}
											placeholder="Enter the title of the serie"
										/>
									</InputGroup>
								)}
							/>

							<FormInput
								control={form.control}
								name="description"
								label="Description"
								render={(field) => (
									<InputGroup>
										<InputGroupTextarea
											disabled={!formInitialized}
											id={field.name}
											{...field}
											value={field.value ?? ""}
											placeholder="Enter the description of the serie"
										/>
									</InputGroup>
								)}
							/>
						</div>
					))}
				</SheetPanel>
				<SheetFooter>
					<LoadingButton
						type="submit"
						isLoading={isSubmitting}
						loadingText="Updating serie..."
					>
						Update serie
					</LoadingButton>
				</SheetFooter>
			</SheetPopup>
		</Sheet>
	);
}

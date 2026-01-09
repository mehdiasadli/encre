"use client";

import {
	UpdateBookInputSchema,
	UpdateChapterInputSchema,
} from "@encre/schemas";
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

interface EditChapterSheetProps {
	render?: React.ComponentProps<typeof SheetTrigger>["render"];
	slug: string;
	bookSlug: string;
}

export function EditChapterSheet({
	render,
	slug,
	bookSlug,
}: EditChapterSheetProps) {
	const [isOpen, setIsOpen] = useQueryState("edit-chapter");
	const router = useRouter();
	const pathname = usePathname();

	const { content, data: chapter } = useContent({
		...orpc.chapters.authorGetChapter.queryOptions({ input: { slug } }),
		enabled: isOpen === slug,
	});

	const form = useForm({
		resolver: zodResolver(
			UpdateChapterInputSchema.omit({
				slug: true,
				status: true,
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
	const formInitialized = useInitializeForm(form, chapter);

	const { mutate: updateChapter, isPending: isSubmitting } = useORPCMutation({
		...orpc.chapters.updateChapter.mutationOptions(),
		invalidateQueries: [
			orpc.chapters.authorGetChapter.queryKey({ input: { slug } }),
			orpc.chapters.authorGetChaptersList.queryKey({
				input: { books: [bookSlug] },
			}),
		],
	});

	const onSubmit = form.handleSubmit((data) => {
		if (!formInitialized) return;
		updateChapter(
			{ slug, ...data },
			{
				onSuccess(data) {
					toast.success("Chapter updated successfully");

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
					<SheetTitle>Edit Chapter</SheetTitle>
					<SheetDescription>Edit the chapter details.</SheetDescription>
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
											placeholder="Enter the title of the chapter"
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
											placeholder="Enter the description of the chapter"
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
						loadingText="Updating chapter..."
					>
						Update chapter
					</LoadingButton>
				</SheetFooter>
			</SheetPopup>
		</Sheet>
	);
}

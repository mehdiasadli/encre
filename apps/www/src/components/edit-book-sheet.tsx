"use client";

import { UpdateBookInputSchema } from "@encre/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
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

interface EditBookSheetProps {
	render?: React.ComponentProps<typeof SheetTrigger>["render"];
	slug: string;
	serieSlug: string;
}

export function EditBookSheet({ render, slug, serieSlug }: EditBookSheetProps) {
	const [isOpen, setIsOpen] = useQueryState("edit-book");

	const { content, data: book } = useContent({
		...orpc.books.authorGetBook.queryOptions({ input: { slug } }),
		enabled: isOpen === slug,
	});

	const form = useForm({
		resolver: zodResolver(
			UpdateBookInputSchema.omit({
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
	const formInitialized = useInitializeForm(form, book);

	const { mutate: updateBook, isPending: isSubmitting } = useORPCMutation({
		...orpc.books.updateBook.mutationOptions(),
		invalidateQueries: [
			orpc.books.authorGetBook.queryKey({ input: { slug } }),
			orpc.books.authorGetBooksList.queryKey({
				input: { series: [serieSlug] },
			}),
		],
		onSuccess() {
			toast.success("Book updated successfully");
			setIsOpen(null);
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		if (!formInitialized) return;
		updateBook({ slug, ...data });
	});

	return (
		<Sheet
			open={isOpen === slug}
			onOpenChange={(open) => setIsOpen(open ? slug : null)}
		>
			<SheetTrigger render={render} />
			<SheetPopup render={<form onSubmit={onSubmit} />} showCloseButton={false}>
				<SheetHeader>
					<SheetTitle>Edit Book</SheetTitle>
					<SheetDescription>Edit the book details.</SheetDescription>
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
											placeholder="Enter the title of the book"
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
											placeholder="Enter the description of the book"
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
						loadingText="Updating book..."
					>
						Update book
					</LoadingButton>
				</SheetFooter>
			</SheetPopup>
		</Sheet>
	);
}

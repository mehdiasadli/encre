"use client";

import { CreateBookInputSchema } from "@encre/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form-input";
import {
	Frame,
	FrameDescription,
	FrameFooter,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from "@/components/ui/frame";
import {
	InputGroup,
	InputGroupInput,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { LoadingButton } from "@/components/ui/loading-button";
import { useORPCMutation } from "@/hooks/use-orpc-mutation";
import { orpc } from "@/utils/orpc";

export default function CreateBookPage() {
	const { serieSlug } = useParams() as { serieSlug: string };
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(CreateBookInputSchema.omit({ serie: true })),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	const { mutate: createBook, isPending: isSubmitting } = useORPCMutation({
		...orpc.books.createBook.mutationOptions(),
		invalidateQueries: [
			orpc.books.authorGetBooksList.queryKey({
				input: {
					series: [serieSlug],
				},
			}),
		],
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
		onSuccess(data) {
			toast.success("Book created successfully");
			router.push(`/dashboard/author/series/${serieSlug}/books/${data.slug}`);
		},
	});

	const onSubmit = form.handleSubmit(
		(data) => {
			createBook({ ...data, serie: serieSlug });
		},
		(errors) => {
			console.log(errors);
		},
	);

	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<Frame>
				<FrameHeader>
					<FrameTitle>Add New Book</FrameTitle>
					<FrameDescription>Add a new book to your serie.</FrameDescription>
				</FrameHeader>
				<FramePanel className="space-y-4">
					<FormInput
						control={form.control}
						name="title"
						label="Title"
						render={(field) => (
							<InputGroup>
								<InputGroupInput
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
									id={field.name}
									{...field}
									value={field.value ?? ""}
									placeholder="Enter the description of the book"
								/>
							</InputGroup>
						)}
					/>
				</FramePanel>
				<FrameFooter>
					<LoadingButton
						disabled={!form.formState.isValid}
						className="ml-auto max-w-sm"
						type="submit"
						isLoading={isSubmitting}
						loadingText="Creating new book..."
					>
						Create New Book
					</LoadingButton>
				</FrameFooter>
			</Frame>
		</form>
	);
}

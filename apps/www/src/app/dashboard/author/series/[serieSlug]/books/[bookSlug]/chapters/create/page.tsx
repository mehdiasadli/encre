"use client";

import { CreateChapterInputSchema } from "@encre/schemas";
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

export default function CreateChapterPage() {
	const { serieSlug, bookSlug } = useParams() as {
		serieSlug: string;
		bookSlug: string;
	};
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(CreateChapterInputSchema.omit({ book: true })),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	const { mutate: createChapter, isPending: isSubmitting } = useORPCMutation({
		...orpc.chapter.createChapter.mutationOptions(),
		invalidateQueries: [
			orpc.chapter.authorGetChaptersList.queryKey({
				input: {
					books: [bookSlug],
				},
			}),
		],
		showErrorToast: false,
		onError(error) {
			if (error.data?.path === "title") {
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
			toast.success("Chapter created successfully");
			router.push(
				`/dashboard/author/series/${serieSlug}/books/${bookSlug}/chapters/${data.slug}`,
			);
		},
	});

	const onSubmit = form.handleSubmit(
		(data) => {
			createChapter({ ...data, book: bookSlug });
		},
		(errors) => {
			console.log(errors);
		},
	);

	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<Frame>
				<FrameHeader>
					<FrameTitle>Add New Chapter</FrameTitle>
					<FrameDescription>Add a new chapter to your book.</FrameDescription>
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
									id={field.name}
									{...field}
									value={field.value ?? ""}
									placeholder="Enter the description of the chapter"
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
						loadingText="Creating new chapter..."
					>
						Create New Chapter
					</LoadingButton>
				</FrameFooter>
			</Frame>
		</form>
	);
}

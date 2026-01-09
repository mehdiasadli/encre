"use client";

import { CreateSerieInputSchema } from "@encre/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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

export default function CreateSeriesPage() {
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(CreateSerieInputSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	const { mutate: createSerie, isPending: isSubmitting } = useORPCMutation({
		...orpc.series.createSerie.mutationOptions(),
		invalidateQueries: [orpc.series.authorGetSeriesList.queryKey()],
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
			toast.success("Serie created successfully");
			router.push(`/dashboard/author/series/${data.slug}`);
		},
	});

	const onSubmit = form.handleSubmit(
		(data) => {
			createSerie(data);
		},
		(errors) => {
			console.log(errors);
		},
	);

	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<Frame>
				<FrameHeader>
					<FrameTitle>Create New Series</FrameTitle>
					<FrameDescription>
						Create a new series to start writing and sharing your thoughts with
						the world.
					</FrameDescription>
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
									placeholder="Enter the title of the series"
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
									placeholder="Enter the description of the series"
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
						loadingText="Creating new series..."
					>
						Create New Series
					</LoadingButton>
				</FrameFooter>
			</Frame>
		</form>
	);
}

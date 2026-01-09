"use client";

import { BecomeAuthorInputSchema } from "@encre/schemas";
import { slugify } from "@encre/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AtSign, GlobeIcon, UserIcon } from "lucide-react";
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
	InputGroupAddon,
	InputGroupInput,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { LoadingButton } from "@/components/ui/loading-button";
import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";

const MAX_BIO_LENGTH = 200;

interface BecomeAuthorFormProps {
	username: string;
	name: string;
}

export function BecomeAuthorForm({ username, name }: BecomeAuthorFormProps) {
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(BecomeAuthorInputSchema),
		defaultValues: {
			slug: username,
			name: name,
			website: undefined,
			bio: undefined,
		},
		mode: "onBlur",
	});

	const { mutate: becomeAuthor, isPending: isSubmitting } = useMutation(
		orpc.author.becomeAuthor.mutationOptions({
			onSuccess() {
				toast.success(
					"Author profile created successfully. You can now start writing.",
				);
				router.push("/dashboard/author");
			},
			onError(error) {
				toast.error(error.message ?? "An unknown error occurred");
			},
		}),
	);

	const onSubmit = form.handleSubmit((values) => {
		becomeAuthor(values);
	});

	return (
		<form onSubmit={onSubmit} className="mx-auto max-w-xl">
			<Frame>
				<FrameHeader>
					<FrameTitle>Become an Author</FrameTitle>
					<FrameDescription>
						Create an author profile to start writing and sharing your thoughts
						with the world.
					</FrameDescription>
				</FrameHeader>
				<FramePanel className="space-y-4">
					<FormInput
						control={form.control}
						name="name"
						label="Your Name (as author)"
						render={(field) => (
							<InputGroup>
								<InputGroupInput
									id={field.name}
									{...field}
									placeholder="Enter your name"
								/>
								<InputGroupAddon align="inline-start">
									<UserIcon />
								</InputGroupAddon>
							</InputGroup>
						)}
					/>
					<FormInput
						control={form.control}
						name="slug"
						label="Author's Slug"
						description="This will be a unique identifier of your author and used on URLs."
						render={(field) => (
							<InputGroup>
								<InputGroupInput
									id={field.name}
									{...field}
									placeholder="Enter author's slug"
									onBlur={(e) => {
										field.onBlur();
										field.onChange(slugify(e.target.value ?? "") ?? "");
									}}
								/>
								<InputGroupAddon align="inline-start">
									<AtSign />
								</InputGroupAddon>
							</InputGroup>
						)}
					/>
					<FormInput
						control={form.control}
						name="website"
						label="Website"
						description="Enter your website URL. This will be displayed on your author profile."
						render={(field) => (
							<InputGroup>
								<InputGroupInput
									id={field.name}
									{...field}
									value={field.value ?? ""}
									placeholder="Enter your website URL"
								/>
								<InputGroupAddon align="inline-start">
									<GlobeIcon />
								</InputGroupAddon>
							</InputGroup>
						)}
					/>
					<FormInput
						control={form.control}
						name="bio"
						label="Bio"
						description={`Write a short bio about yourself. Maximum ${MAX_BIO_LENGTH} characters.`}
						render={(field) => (
							<InputGroup>
								<InputGroupTextarea
									id={field.name}
									{...field}
									value={field.value ?? ""}
									placeholder="Write a bio..."
									onChange={(e) => {
										field.onChange(e.target.value);
										if (e.target.value.length > MAX_BIO_LENGTH) {
											field.onChange(e.target.value.slice(0, MAX_BIO_LENGTH));
										}
									}}
								/>
								<InputGroupAddon
									align="block-end"
									className={"w-full justify-end"}
								>
									<span
										className={cn(
											"text-muted-foreground text-xs",
											getBioLengthColor(field.value?.length),
										)}
									>
										{field.value?.length ?? 0}/{MAX_BIO_LENGTH}
									</span>
								</InputGroupAddon>
							</InputGroup>
						)}
					/>
				</FramePanel>
				<FrameFooter>
					<LoadingButton
						type="submit"
						isLoading={isSubmitting}
						loadingText="Creating author profile..."
					>
						Become an author
					</LoadingButton>
				</FrameFooter>
			</Frame>
		</form>
	);
}

function getBioLengthColor(length?: number) {
	if (!length) return "text-muted-foreground";
	if (length > MAX_BIO_LENGTH * 0.75) return "text-warning-foreground";
	if (length > MAX_BIO_LENGTH * 0.9) return "text-destructive";
	return "text-muted-foreground";
}

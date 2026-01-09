"use client";

import { SignUpInputSchema, type User } from "@encre/schemas";
import { tryCatch } from "@encre/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SuccessContext } from "better-auth/client";
import { AtSign, Mail, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { authClient } from "@/lib/auth-client";
import { BetterFetchError } from "@/lib/better-fetch";
import { parseAsEmail, parseAsURLOrPath, parseAsUsername } from "@/utils/nuqs";
import { FormInput } from "./form-input";
import {
	Dialog,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogPopup,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { LoadingButton } from "./ui/loading-button";
import { PasswordInput } from "./ui/password-input";

interface SignUpDialogProps {
	render: React.ComponentProps<typeof DialogTrigger>["render"];
	onSuccess?: (
		ctx: SuccessContext<{
			token: string | null;
			user: User;
		}>,
	) => void;
	onError?: (error: BetterFetchError) => void;
}

export function SignUpDialog({
	render,
	onSuccess,
	onError,
}: SignUpDialogProps) {
	const { data: session, isPending } = authClient.useSession();
	const [isOpen, setIsOpen] = useAuthDialog("sign-up");
	const [defaultEmail] = useQueryState("email", parseAsEmail);
	const [defaultName] = useQueryState("name", parseAsString);
	const [defaultUsername] = useQueryState("username", parseAsUsername);
	const [callbackURL] = useQueryState("callbackURL", parseAsURLOrPath);
	const [isSubmitting, startTransition] = useTransition();
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			email: defaultEmail ?? "",
			name: defaultName ?? "",
			username: defaultUsername ?? "",
			password: "",
			confirmPassword: "",
		},
		resolver: zodResolver(SignUpInputSchema),
	});

	const onOpenChange = (open: boolean) => {
		if (form.formState.isSubmitting) return;

		form.reset();
		setIsOpen(open);
	};

	const onSubmit = form.handleSubmit(async (values) => {
		startTransition(async () => {
			const [, error] = await tryCatch(
				authClient.signUp.email({
					email: values.email,
					name: values.name,
					username: values.username,
					password: values.password,
					callbackURL: callbackURL ?? "/",
					fetchOptions: {
						onError(error) {
							toast.error(
								error.error.message ??
									error.error.statusText ??
									"An unknown error occurred",
							);
							onError?.(error.error);
						},
						onSuccess(ctx) {
							console.log("SIGN UP SUCCESS DATA", ctx);
							toast.success("Signed up successfully");
							onOpenChange(false);
							onSuccess?.(ctx);
							router.refresh();
						},
					},
				}),
				(error) =>
					error instanceof BetterFetchError
						? error
						: new BetterFetchError(
								500,
								"An unknown error occurred",
								new Error("An unknown error occurred"),
							),
			);

			if (error) {
				toast.error(
					error.error.message ??
						error.error.statusText ??
						"An unknown error occurred",
				);
				onError?.(error);
			}
		});
	});

	if (session || isPending) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogTrigger render={render} />
			<DialogPopup
				showCloseButton={false}
				render={<form onSubmit={onSubmit} />}
			>
				<DialogHeader>
					<DialogTitle>Welcome!</DialogTitle>
					<DialogDescription>Create an account to continue.</DialogDescription>
				</DialogHeader>
				<DialogPanel className="space-y-4">
					<FormInput
						control={form.control}
						name="email"
						label="Email"
						render={(field) => (
							<InputGroup>
								<InputGroupInput
									id={field.name}
									placeholder="Enter your email"
									{...field}
								/>
								<InputGroupAddon align="inline-start">
									<Mail />
								</InputGroupAddon>
							</InputGroup>
						)}
					/>
					<FormInput
						control={form.control}
						name="name"
						label="Name"
						render={(field) => (
							<InputGroup>
								<InputGroupInput
									id={field.name}
									placeholder="Enter your name"
									{...field}
								/>
								<InputGroupAddon align="inline-start">
									<UserIcon />
								</InputGroupAddon>
							</InputGroup>
						)}
					/>

					<FormInput
						control={form.control}
						name="username"
						label="Username"
						render={(field) => (
							<InputGroup>
								<InputGroupInput
									id={field.name}
									placeholder="Enter your username"
									{...field}
								/>
								<InputGroupAddon align="inline-start">
									<AtSign />
								</InputGroupAddon>
							</InputGroup>
						)}
					/>

					<FormInput
						control={form.control}
						name="password"
						label="Password"
						render={(field) => (
							<PasswordInput
								id={field.name}
								placeholder="••••••••"
								{...field}
							/>
						)}
					/>

					<FormInput
						control={form.control}
						name="confirmPassword"
						label="Confirm Password"
						render={(field) => (
							<PasswordInput
								id={field.name}
								placeholder="••••••••"
								{...field}
							/>
						)}
					/>
				</DialogPanel>
				<DialogFooter>
					<LoadingButton
						type="submit"
						isLoading={isSubmitting}
						loadingText="Signing up..."
					>
						Sign up
					</LoadingButton>
				</DialogFooter>
			</DialogPopup>
		</Dialog>
	);
}

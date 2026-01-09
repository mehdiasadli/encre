"use client";

import { LoginInputSchema } from "@encre/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SuccessContext } from "better-auth/client";
import { useRouter } from "next/navigation";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { authClient } from "@/lib/auth-client";
import { BetterFetchError } from "@/lib/better-fetch";
import { parseAsEmail } from "@/utils/nuqs";
import { ForgotPasswordDialog } from "./forgot-password-dialog";
import { FormInput } from "./form-input";
import { Checkbox } from "./ui/checkbox";
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
import { FieldLabel } from "./ui/field";
import { InputGroup, InputGroupInput } from "./ui/input-group";
import { LoadingButton } from "./ui/loading-button";
import { PasswordInput } from "./ui/password-input";

interface SignInDialogProps {
	render: React.ComponentProps<typeof DialogTrigger>["render"];
	onSuccess?: (ctx: SuccessContext<unknown>) => void;
	onError?: (error: BetterFetchError) => void;
}

export function SignInDialog({
	render,
	onSuccess,
	onError,
}: SignInDialogProps) {
	const { data: session, isPending } = authClient.useSession();
	const [isOpen, setIsOpen] = useAuthDialog("sign-in");
	const [defaultEmail] = useQueryState("email", parseAsEmail);
	const [defaultRememberMe] = useQueryState("rememberMe", parseAsBoolean);
	const [callbackURL] = useQueryState("callbackURL", parseAsString);
	const [isSubmitting, startTransition] = useTransition();
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			email: defaultEmail ?? "",
			rememberMe: defaultRememberMe ?? false,
			password: "",
		},
		resolver: zodResolver(LoginInputSchema),
		mode: "onBlur",
	});

	const onOpenChange = (open: boolean) => {
		if (form.formState.isSubmitting) return;

		form.reset();
		setIsOpen(open);
	};

	const onSubmit = form.handleSubmit(async (values) => {
		startTransition(async () => {
			try {
				await authClient.signIn.email({
					email: values.email,
					password: values.password,
					callbackURL: callbackURL ?? "/",
					rememberMe: values.rememberMe,
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
							console.log("LOGIN SUCCESS DATA", ctx);
							toast.success("Signed in successfully");
							onOpenChange(false);
							onSuccess?.(ctx);
							router.refresh();
						},
					},
				});
			} catch (error) {
				const err =
					error instanceof BetterFetchError
						? error
						: new BetterFetchError(
								500,
								"An unknown error occurred",
								new Error("An unknown error occurred"),
							);
				toast.error(
					err.error.message ??
						err.error.statusText ??
						"An unknown error occurred",
				);
				onError?.(err);
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
					<DialogTitle>Welcome Back!</DialogTitle>
					<DialogDescription>
						Sign in to your account to continue.
					</DialogDescription>
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
							</InputGroup>
						)}
					/>
					<FormInput
						control={form.control}
						name="password"
						label={
							<FieldLabel className="flex items-center justify-between">
								<span>Password</span>
								<ForgotPasswordDialog
									render={
										<span className="cursor-pointer text-muted-foreground text-xs hover:underline">
											Forgot password?
										</span>
									}
								/>
							</FieldLabel>
						}
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
						name="rememberMe"
						render={(field) => (
							<div className="flex items-center gap-2">
								<Checkbox
									id={field.name}
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
								<FieldLabel htmlFor={field.name}>Remember me</FieldLabel>
							</div>
						)}
					/>
				</DialogPanel>
				<DialogFooter>
					<LoadingButton
						type="submit"
						isLoading={isSubmitting}
						loadingText="Signing in..."
					>
						Sign in
					</LoadingButton>
				</DialogFooter>
			</DialogPopup>
		</Dialog>
	);
}

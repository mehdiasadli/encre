"use client";

import { ForgetPasswordInputSchema } from "@encre/schemas";
import { tryCatch } from "@encre/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SuccessContext } from "better-auth/client";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { BetterFetchError } from "@/lib/better-fetch";
import { parseAsEmail } from "@/utils/nuqs";
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

interface ForgotPasswordDialogProps {
	render: React.ComponentProps<typeof DialogTrigger>["render"];
	onSuccess?: (ctx: SuccessContext<unknown>) => void;
	onError?: (error: BetterFetchError) => void;
}

export function ForgotPasswordDialog({
	render,
	onSuccess,
	onError,
}: ForgotPasswordDialogProps) {
	const { data: session, isPending } = authClient.useSession();
	const [isOpen, setIsOpen] = useQueryState(
		"forgot-password",
		parseAsBoolean.withDefault(false),
	);
	const [defaultEmail] = useQueryState("email", parseAsEmail);
	const [callbackURL] = useQueryState("callbackURL", parseAsString);
	const [isSubmitting, startTransition] = useTransition();
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			email: defaultEmail ?? "",
		},
		resolver: zodResolver(ForgetPasswordInputSchema),
		mode: "onBlur",
	});

	const onOpenChange = (open: boolean) => {
		if (form.formState.isSubmitting) return;

		form.reset();
		setIsOpen(open);
	};

	const onSubmit = form.handleSubmit(async (values) => {
		startTransition(async () => {
			const [, error] = await tryCatch(
				authClient.requestPasswordReset({
					email: values.email,
					redirectTo: callbackURL ?? "/",
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
							toast.success(
								"Reset email sent successfully. Check your email for the reset link.",
							);
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
					<DialogTitle>Forgot Password?</DialogTitle>
					<DialogDescription>
						Enter your email to reset your password.
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
								<InputGroupAddon align="inline-start">
									<Mail />
								</InputGroupAddon>
							</InputGroup>
						)}
					/>
				</DialogPanel>
				<DialogFooter>
					<LoadingButton
						type="submit"
						isLoading={isSubmitting}
						loadingText="Sending..."
					>
						Send reset email
					</LoadingButton>
				</DialogFooter>
			</DialogPopup>
		</Dialog>
	);
}

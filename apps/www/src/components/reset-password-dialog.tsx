"use client";

import { ResetPasswordInputSchema } from "@encre/schemas";
import { tryCatch } from "@encre/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SuccessContext } from "better-auth/client";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { authClient } from "@/lib/auth-client";
import { BetterFetchError } from "@/lib/better-fetch";
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
import { LoadingButton } from "./ui/loading-button";
import { PasswordInput } from "./ui/password-input";

interface ResetPasswordDialogProps {
	render: React.ComponentProps<typeof DialogTrigger>["render"];
	onSuccess?: (ctx: SuccessContext<unknown>) => void;
	onError?: (error: BetterFetchError) => void;
}

export function ResetPasswordDialog({
	render,
	onSuccess,
	onError,
}: ResetPasswordDialogProps) {
	const { data: session, isPending } = authClient.useSession();
	const [isOpen, setIsOpen] = useAuthDialog("reset-password");
	const [token] = useQueryState("token", parseAsString);
	const [isSubmitting, startTransition] = useTransition();
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			token: token ?? "",
			newPassword: "",
			confirmNewPassword: "",
		},
		resolver: zodResolver(ResetPasswordInputSchema),
		mode: "onBlur",
	});

	const onOpenChange = (open: boolean) => {
		if (form.formState.isSubmitting) return;

		form.reset();
		setIsOpen(open);
	};

	const onSubmit = form.handleSubmit(async (values) => {
		if (!token) {
			toast.error("Invalid reset token");
			return;
		}

		startTransition(async () => {
			if (values.newPassword !== values.confirmNewPassword) {
				form.setError("confirmNewPassword", {
					message: "Passwords do not match",
				});
				return;
			}

			const [, error] = await tryCatch(
				authClient.resetPassword({
					token,
					newPassword: values.newPassword,
					fetchOptions: {
						onError(error) {
							toast.error(
								error.error.message ??
									error.error.statusText ??
									"An unknown error occurred",
							);
						},
						onSuccess(data) {
							toast.success(
								"Reset email sent successfully. Check your email for the reset link.",
							);
							onOpenChange(false);
							onSuccess?.(data);
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

	if (session || isPending || !token) {
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
						name="newPassword"
						label="New Password"
						render={(field) => (
							<PasswordInput
								id={field.name}
								placeholder="Enter your new password"
								{...field}
							/>
						)}
					/>

					<FormInput
						control={form.control}
						name="confirmNewPassword"
						label="Confirm New Password"
						render={(field) => (
							<PasswordInput
								id={field.name}
								placeholder="Confirm your new password"
								{...field}
							/>
						)}
					/>
				</DialogPanel>
				<DialogFooter>
					<LoadingButton
						type="submit"
						isLoading={isSubmitting}
						loadingText="Resetting password..."
					>
						Reset password
					</LoadingButton>
				</DialogFooter>
			</DialogPopup>
		</Dialog>
	);
}

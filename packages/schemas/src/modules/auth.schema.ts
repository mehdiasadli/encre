import { z } from "zod";
import { usernameRegex } from "../regex";

export const LoginInputSchema = z.object({
	email: z.email("Invalid email address"),
	password: z
		.string("Password must be a string")
		.min(7, "Password must be at least 7 characters"),
	rememberMe: z.boolean("Remember me must be a boolean"),
});

export type LoginInputType = z.infer<typeof LoginInputSchema>;

export const SignUpInputSchema = z
	.object({
		email: z.email("Invalid email address"),
		name: z
			.string("Name must be a string")
			.min(1, "Name must be at least 1 character"),
		username: z
			.string("Username must be a string")
			.regex(
				usernameRegex,
				"Username must contain only letters, numbers, underscores, and hyphens",
			)
			.min(4, "Username must be at least 4 characters"),
		password: z
			.string("Password must be a string")
			.min(7, "Password must be at least 7 characters"),
		confirmPassword: z
			.string("Confirm password must be a string")
			.min(7, "Confirm password must be at least 7 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type SignUpInputType = z.infer<typeof SignUpInputSchema>;

export const ForgetPasswordInputSchema = z.object({
	email: z.email("Invalid email address"),
});

export type ForgetPasswordInputType = z.infer<typeof ForgetPasswordInputSchema>;

export const ResetPasswordInputSchema = z
	.object({
		token: z.string("Token must be a string"),
		newPassword: z
			.string("New password must be a string")
			.min(7, "New password must be at least 7 characters"),
		confirmNewPassword: z
			.string("Confirm new password must be a string")
			.min(7, "Confirm new password must be at least 7 characters"),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords do not match",
		path: ["confirmNewPassword"],
	});

export type ResetPasswordInputType = z.infer<typeof ResetPasswordInputSchema>;

export const VerifyEmailInputSchema = z.object({
	token: z.string("Token must be a string"),
});

export type VerifyEmailInputType = z.infer<typeof VerifyEmailInputSchema>;

export const ResendVerificationEmailInputSchema = ForgetPasswordInputSchema;

export type ResendVerificationEmailInputType = z.infer<
	typeof ResendVerificationEmailInputSchema
>;

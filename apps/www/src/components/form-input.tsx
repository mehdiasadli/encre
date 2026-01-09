"use client";

import {
	Controller,
	type ControllerFieldState,
	type ControllerProps,
	type ControllerRenderProps,
	type FieldPath,
	type FieldValues,
	type UseFormStateReturn,
} from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";

interface FormInputProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
> extends Pick<
		ControllerProps<TFieldValues, TName, TTransformedValues>,
		"control" | "defaultValue" | "name"
	> {
	label?: React.ReactNode;
	description?: React.ReactNode;
	labelProps?: Omit<
		React.ComponentProps<typeof FieldLabel>,
		"className" | "children"
	>;
	descriptionProps?: Omit<
		React.ComponentProps<typeof FieldDescription>,
		"className" | "children"
	>;
	errorProps?: Omit<React.ComponentProps<"p">, "className">;
	labelClassName?: string;
	descriptionClassName?: string;
	errorClassName?: string;
	containerClassName?: string;
	containerProps?: Omit<
		React.ComponentProps<typeof Field>,
		"className" | "children"
	>;
	render: (
		field: ControllerRenderProps<TFieldValues, TName>,
		fieldState: ControllerFieldState,
		formState: UseFormStateReturn<TFieldValues>,
	) => React.ReactNode;
	required?: boolean;
	translate?: (key: string) => string;
}

export function FormInput<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
>({
	label,
	description,
	labelProps,
	descriptionProps,
	errorProps,
	labelClassName,
	descriptionClassName,
	errorClassName,
	containerClassName,
	containerProps,
	render,
	required = false,
	translate,
	...props
}: FormInputProps<TFieldValues, TName, TTransformedValues>) {
	return (
		<Controller
			{...props}
			render={({ field, fieldState, formState }) => {
				const errorMessage = formState.errors[props.name]?.message as
					| string
					| undefined;
				const translatedErrorMessage = translate
					? translate(errorMessage || "common.errors.defaults.input")
					: errorMessage;

				return (
					<Field className={containerClassName} {...containerProps}>
						{label && (
							<FieldLabel
								htmlFor={field.name}
								className={labelClassName}
								{...labelProps}
							>
								{label}
								{required && (
									<span className="text-destructive-foreground">*</span>
								)}
							</FieldLabel>
						)}
						{description && typeof description === "string" && (
							<FieldDescription
								className={descriptionClassName}
								{...descriptionProps}
							>
								{description}
							</FieldDescription>
						)}

						{render(field, fieldState, formState)}

						{errorMessage && (
							<FieldError className={errorClassName} {...errorProps}>
								{translatedErrorMessage}
							</FieldError>
						)}
					</Field>
				);
			}}
		/>
	);
}

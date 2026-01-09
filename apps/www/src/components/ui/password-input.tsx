"use client";

import { EyeIcon, EyeOffIcon, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

interface PasswordInputProps
	extends React.ComponentProps<typeof InputGroupInput> {
	showPasswordIcon?: React.ReactNode;
	hidePasswordIcon?: React.ReactNode;
	groupClassName?: string;
	addonClassName?: string;
	align?: React.ComponentProps<typeof InputGroupAddon>["align"];
	onAddonClick?: (state: boolean) => void;
	showLockIcon?: boolean;
	lockIcon?: React.ReactNode;
}

export function PasswordInput({
	showPasswordIcon = <EyeIcon className="h-4 w-4" />,
	hidePasswordIcon = <EyeOffIcon className="h-4 w-4" />,
	groupClassName,
	addonClassName,
	align = "inline-end",
	onAddonClick,
	showLockIcon = true,
	lockIcon = <Lock />,
	...props
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<InputGroup className={groupClassName}>
			<InputGroupInput {...props} type={showPassword ? "text" : "password"} />
			{showLockIcon && (
				<InputGroupAddon align="inline-start">{lockIcon}</InputGroupAddon>
			)}
			<InputGroupAddon
				align={align}
				className={cn("cursor-pointer", addonClassName)}
				onClick={() => {
					const newShowPassword = !showPassword;

					setShowPassword(newShowPassword);
					onAddonClick?.(newShowPassword);
				}}
			>
				{showPassword ? hidePasswordIcon : showPasswordIcon}
			</InputGroupAddon>
		</InputGroup>
	);
}

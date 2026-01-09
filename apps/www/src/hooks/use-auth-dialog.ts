import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useMemo } from "react";
import { authClient } from "@/lib/auth-client";

export const AUTH_DIALOGS = [
	"sign-in",
	"sign-up",
	"forgot-password",
	"reset-password",
] as const;

export function useAuthDialog(dialog: (typeof AUTH_DIALOGS)[number]) {
	const { data: session } = authClient.useSession();

	const canShowAuthDialog = useMemo(() => !session, [session]);

	const [openDialog, setOpenDialog] = useQueryState(
		"auth",
		parseAsStringLiteral(AUTH_DIALOGS),
	);

	const isOpen = canShowAuthDialog ? openDialog === dialog : false;
	const setOpen = (open: boolean) =>
		setOpenDialog(canShowAuthDialog ? (open ? dialog : null) : null);

	return [isOpen, setOpen] as const;
}

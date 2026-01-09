import { useEffect, useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export function useInitializeForm<T extends FieldValues>(
	form: UseFormReturn<T>,
	data: T | undefined,
) {
	const formInitialized = useRef(false);

	useEffect(() => {
		if (formInitialized.current) return;
		if (!data) return;

		form.reset(data);
		formInitialized.current = true;
	}, [data, form]);

	return formInitialized.current;
}

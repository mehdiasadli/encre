type Success<T> = [data: T, error: null];
type Failure<E extends Error = Error> = [data: null, error: E];
type Result<T, E extends Error = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E extends Error = Error>(
	fn: (() => Promise<T>) | Promise<T>,
	errorMapper?: (error: unknown) => E,
): Promise<Result<T, E>> {
	try {
		const data = await (typeof fn === "function" ? fn() : fn);
		return [data, null];
	} catch (error) {
		if (errorMapper) {
			return [null, errorMapper(error)];
		}

		return [
			null,
			error instanceof Error ? error : new Error(String(error)),
		] as Failure<E>;
	}
}

export async function tryCatchAll<
	T extends readonly unknown[],
	E extends Error = Error,
>(
	fns: { [K in keyof T]: (() => Promise<T[K]>) | Promise<T[K]> },
	errorMapper?: (error: unknown) => E,
): Promise<Result<T, E>> {
	try {
		const promises = fns.map((fn) => (typeof fn === "function" ? fn() : fn));
		const data = (await Promise.all(promises)) as unknown as T;
		return [data, null];
	} catch (error) {
		if (errorMapper) {
			return [null, errorMapper(error)];
		}
		return [
			null,
			error instanceof Error ? error : new Error(String(error)),
		] as Failure<E>;
	}
}

export function tryCatchSync<T, E extends Error = Error>(
	fn: () => T,
	errorMapper?: (error: unknown) => E,
): Result<T, E> {
	try {
		const data = fn();
		return [data, null];
	} catch (error) {
		if (errorMapper) {
			return [null, errorMapper(error)];
		}
		return [
			null,
			error instanceof Error ? error : new Error(String(error)),
		] as Failure<E>;
	}
}

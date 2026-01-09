export class BetterFetchError extends Error {
	constructor(
		public status: number,
		public statusText: string,
		// biome-ignore lint/suspicious/noExplicitAny: error can be any value
		public error: any,
	) {
		super(error instanceof Error ? error.message : statusText);
		this.status = status;
		this.statusText = statusText;
		this.error = error instanceof Error ? error : new Error(statusText);
	}
}

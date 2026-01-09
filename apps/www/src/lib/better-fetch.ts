export class BetterFetchError extends Error {
	status: number;
	statusText: string;
	error: any;

	constructor(status: number, statusText: string, error: any) {
		super(error.message ?? statusText);
		this.status = status;
		this.statusText = statusText;
		this.error = error;
	}
}

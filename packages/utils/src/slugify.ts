export function slugify(text: string) {
	return text
		.toLowerCase()
		.trim()
		.replace(/ü/g, "u")
		.replace(/ö/g, "o")
		.replace(/ş/g, "sh")
		.replace(/ç/g, "ch")
		.replace(/ğ/g, "g")
		.replace(/ı/g, "i")
		.replace(/ə/g, "e")
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(
	text: string,
	checkIfExists: (slug: string) => Promise<null | undefined | unknown>,
	maxAttempts = 10,
) {
	const originalSlug = slugify(text);
	let result = originalSlug;
	let attempt = 0;

	while (attempt < maxAttempts) {
		const exists = await checkIfExists(result);

		if (exists === undefined || exists === null) {
			return result;
		}

		result = `${originalSlug}-${++attempt}`;
	}

	throw new Error(
		`Failed to generate unique slug after ${maxAttempts} attempts`,
	);
}

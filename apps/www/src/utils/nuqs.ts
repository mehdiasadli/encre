////
// CUSTOM PARSERS
////

import { env } from "@encre/env/www";
import { slugRegex, usernameRegex } from "@encre/schemas";
import { tryCatchSync } from "@encre/utils";
import { createParser } from "nuqs";
import z from "zod";

export const parseAsEmail = createParser({
	parse: (value) => z.email().parse(value),
	serialize: (value) => String(value),
});

export const parseAsURL = createParser({
	parse: (value) => z.url().parse(value),
	serialize: (value) => String(value),
});

export const parseAsUUID = createParser({
	parse: (value) => z.uuid().parse(value),
	serialize: (value) => String(value),
});

export const parseAsLatLng = createParser({
	parse: (value) => z.tuple([z.number(), z.number()]).parse(value),
	serialize: (value) => value.join(","),
	eq: (a, b) => a[0] === b[0] && a[1] === b[1],
});

export const parseAsUsername = createParser({
	parse: (value) => z.string().regex(usernameRegex).parse(value),
	serialize: (value) => String(value),
});

export const parseAsSlug = createParser({
	parse: (value) => z.string().regex(slugRegex).parse(value),
	serialize: (value) => String(value),
});

export const parseAsPage = createParser({
	parse: (value) => z.number().int().positive().parse(value),
	serialize: (value) => {
		if (isNaN(value)) return "1";
		return String(value);
	},
});

export const parseAsTake = createParser({
	parse: (value) => z.number().int().positive().max(100).parse(value),
	serialize: (value) => {
		if (isNaN(value)) return "20";
		return String(value);
	},
});

export const parseAsURLOrPath = createParser({
	parse: (value) =>
		z
			.string()
			.refine((value) => {
				const [url, error] = tryCatchSync(() => new URL(value));

				if (error) {
					return `${env.NEXT_PUBLIC_BASE_URL}${value.startsWith("/") ? value : `/${value}`}`;
				}

				return url.toString();
			})
			.parse(value),
	serialize: (value) => String(value),
});

type CapitalizationType =
	| "first"
	| "all"
	| "none"
	| "upper"
	| "lower"
	| "title";

interface FormatEnumOptions {
	separator?: string;
	joiner?: string;
	capitalization?: CapitalizationType;
	emptyText?: string;
}

const TITLE_CASE_SKIP_WORDS = [
	"a",
	"an",
	"the",
	"and",
	"but",
	"or",
	"for",
	"nor",
	"on",
	"at",
	"to",
	"by",
	"of",
	"in",
	"with",
];

export function formatEnum(
	value?: string | undefined | null,
	options?: FormatEnumOptions,
) {
	const {
		separator = "_",
		joiner = " ",
		capitalization = "all",
		emptyText = "",
	} = options ?? {};

	if (!value) return emptyText;

	const words = value.replace(new RegExp(`${separator}`, "g"), joiner);

	switch (capitalization) {
		case "first":
			return words.charAt(0).toUpperCase() + words.slice(1);
		case "none":
			return words;
		case "upper":
			return words.toUpperCase();
		case "lower":
			return words.toLowerCase();
		case "title":
			return words
				.split(joiner)
				.map((word, index) => {
					if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1);
					if (TITLE_CASE_SKIP_WORDS.includes(word)) return word;
					return word.charAt(0).toUpperCase() + word.slice(1);
				})
				.join(joiner);
		default:
			return words.replace(/\b\w/g, (char) => char.toUpperCase());
	}
}

export function formatEnumForOptions<T extends readonly string[]>(
	value: T,
	mapper?: {
		[key in T[number]]?: string | { description?: string; label?: string };
	},
	formatEnumOptions?: FormatEnumOptions,
) {
	return value.map((item: T[number]) => {
		const mapperItem = mapper?.[item];

		if (!mapperItem) {
			return {
				value: item,
				label: formatEnum(item, formatEnumOptions),
				description: undefined,
			};
		}

		if (typeof mapperItem === "string") {
			return {
				value: item,
				label: formatEnum(item, formatEnumOptions),
				description: mapperItem,
			};
		}

		return {
			value: item,
			label: mapperItem.label ?? formatEnum(item, formatEnumOptions),
			description: mapperItem.description,
		};
	});
}

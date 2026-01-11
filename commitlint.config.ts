import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			[
				"feat",
				"fix",
				"chore",
				"refactor",
				"docs",
				"style",
				"test",
				"build",
				"ci",
				"perf",
				"other",
			],
		],
	},
};

export default config;

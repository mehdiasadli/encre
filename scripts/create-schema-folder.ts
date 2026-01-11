#!/usr/bin/env bun

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Usage:
 *
 * bun run create-schema <schema-name> --ignore=create?,update?,delete?,get-one?,get-many?
 */
const schemaName = process.argv[2];
const ignoredServices = process.argv[3]?.split(",") || [];

const ignorables = [
	"create",
	"c",
	"update",
	"u",
	"delete",
	"d",
	"get-one",
	"go",
	"get-many",
	"gm",
];

for (const ignoredService of ignoredServices) {
	if (!ignorables.includes(ignoredService)) {
		console.error(`❌ Error: Invalid service: ${ignoredService}`);
		process.exit(1);
	}
}

if (!schemaName) {
	console.error("❌ Error: Schema name is required");
	console.log("Usage: bun run create-schema <schema-name>");
	console.log("Example: bun run create-schema feedback");
	console.log(
		"Note: schema name should be in singular form: e.g. feedback, serie, book; not: feedbacks, series, books",
	);
	process.exit(1);
}

// Validate schema name
if (!/^[a-z0-9-]+$/.test(schemaName)) {
	console.error(
		"❌ Error: Schema name must contain only lowercase letters, numbers, and hyphens",
	);
	process.exit(1);
}

const schemaDir = join(
	process.cwd(),
	"packages",
	"schemas",
	"src",
	"modules",
	schemaName,
);

// Check if schema folder already exists
if (existsSync(schemaDir)) {
	console.error(
		`❌ Error: Schema folder '@encre/schemas/${schemaName}' already exists`,
	);
	process.exit(1);
}

// Create schema folder structure
const barrelFile = join(schemaDir, "index.ts");
const createFile = join(schemaDir, `create-${schemaName}.ts`);
const updateFile = join(schemaDir, `update-${schemaName}.ts`);
const deleteFile = join(schemaDir, `delete-${schemaName}.ts`);
const getOneFile = join(schemaDir, `get-one-${schemaName}.ts`);
const getManyFile = join(schemaDir, `get-many-${schemaName}.ts`);

try {
	await mkdir(schemaDir, { recursive: true });

	const capitalized = capitalize(schemaName);

	const createContent = `import type { z } from "zod";
import { ${capitalized}Schema } from "../../models";

export const Create${capitalized}InputSchema = ${capitalized}Schema.pick({
});
export type Create${capitalized}InputType = z.infer<typeof Create${capitalized}InputSchema>;

export const Create${capitalized}OutputSchema = ${capitalized}Schema.pick({
});
export type Create${capitalized}OutputType = z.infer<typeof Create${capitalized}OutputSchema>;
`;

	const updateContent = `import type { z } from "zod";
import { ${capitalized}Schema } from "../../models";

export const Update${capitalized}InputSchema = ${capitalized}Schema.pick({
}).partial();
export type Update${capitalized}InputType = z.infer<typeof Update${capitalized}InputSchema>;

export const Update${capitalized}OutputSchema = ${capitalized}Schema.pick({
});
export type Update${capitalized}OutputType = z.infer<typeof Update${capitalized}OutputSchema>;
`;

	const deleteContent = `import type { z } from "zod";
import { ${capitalized}Schema } from "../../models";

export const Delete${capitalized}InputSchema = ${capitalized}Schema.pick({
});
export type Delete${capitalized}InputType = z.infer<typeof Delete${capitalized}InputSchema>;

export const Delete${capitalized}OutputSchema = ${capitalized}Schema.pick({
});
export type Delete${capitalized}OutputType = z.infer<typeof Delete${capitalized}OutputSchema>;
`;

	const getOneContent = `import type { z } from "zod";
import { ${capitalized}Schema } from "../../models";

export const GetOne${capitalized}InputSchema = ${capitalized}Schema.pick({
});
export type GetOne${capitalized}InputType = z.infer<typeof GetOne${capitalized}InputSchema>;

export const GetOne${capitalized}OutputSchema = ${capitalized}Schema.pick({
});
export type GetOne${capitalized}OutputType = z.infer<typeof GetOne${capitalized}OutputSchema>;
`;

	const getManyContent = `import { z } from "zod";
import { ${capitalized}Schema } from "../../models";

export const GetMany${capitalized}InputSchema = ${capitalized}Schema.pick({
});
export type GetMany${capitalized}InputType = z.infer<typeof GetMany${capitalized}InputSchema>;

export const GetMany${capitalized}OutputSchema = z.array(${capitalized}Schema);
export type GetMany${capitalized}OutputType = z.infer<typeof GetMany${capitalized}OutputSchema>;
`;

	const generateCreateFile =
		!ignoredServices.includes("create") && !ignoredServices.includes("c");
	const generateUpdateFile =
		!ignoredServices.includes("update") && !ignoredServices.includes("u");
	const generateDeleteFile =
		!ignoredServices.includes("delete") && !ignoredServices.includes("d");
	const generateGetOneFile =
		!ignoredServices.includes("get-one") && !ignoredServices.includes("go");
	const generateGetManyFile =
		!ignoredServices.includes("get-many") && !ignoredServices.includes("gm");

	if (generateCreateFile) {
		await writeFile(createFile, createContent);
	}
	if (generateUpdateFile) {
		await writeFile(updateFile, updateContent);
	}
	if (generateDeleteFile) {
		await writeFile(deleteFile, deleteContent);
	}
	if (generateGetOneFile) {
		await writeFile(getOneFile, getOneContent);
	}
	if (generateGetManyFile) {
		await writeFile(getManyFile, getManyContent);
	}

	let barrelContent = "";

	if (generateCreateFile) {
		barrelContent += `export * from "./create-${schemaName}";\n`;
	}
	if (generateDeleteFile) {
		barrelContent += `export * from "./delete-${schemaName}";\n`;
	}
	if (generateGetManyFile) {
		barrelContent += `export * from "./get-many-${schemaName}";\n`;
	}
	if (generateGetOneFile) {
		barrelContent += `export * from "./get-one-${schemaName}";\n`;
	}
	if (generateUpdateFile) {
		barrelContent += `export * from "./update-${schemaName}";\n`;
	}

	if (barrelContent.length > 0) {
		await writeFile(barrelFile, barrelContent);
	} else {
		await writeFile(barrelFile, "export {};\n");
	}

	// go to packages/schemas/src/modules/index.ts
	// add `export * from "./${schemaName}";`
	const indexFile = join(
		process.cwd(),
		"packages",
		"schemas",
		"src",
		"modules",
		"index.ts",
	);
	const indexContent = `export * from "./${schemaName}";`;
	const currentIndexContent = await readFile(indexFile, "utf-8");

	if (!currentIndexContent.includes(indexContent)) {
		const newIndexContent = `${currentIndexContent}export * from "./${schemaName}";`;
		await writeFile(indexFile, newIndexContent);
	}

	console.log(
		`✅ Schema folder '@encre/schemas/${schemaName}' created successfully!`,
	);
	console.log("");
	console.log(`📁 Location: packages/schemas/src/modules/${schemaName}`);
	console.log("");
	console.log("Next steps:");
	console.log(`  1. cd packages/schemas/src/modules/${schemaName}`);
	console.log("  2. Start building your schema in index.ts");
	console.log("  3. Add dependencies if needed");
} catch (error) {
	console.error("❌ Error creating schema folder:", error);
	process.exit(1);
}

function capitalize(str: string) {
	return str
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join("");
}

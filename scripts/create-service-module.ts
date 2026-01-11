#!/usr/bin/env bun

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Usage:
 *
 * bun run create-service <service-name>
 */
const serviceName = process.argv[2];

if (!serviceName) {
	console.error("❌ Error: Service name is required");
	console.log("Usage: bun run create-service <service-name>");
	console.log("Example: bun run create-service feedback");
	process.exit(1);
}

// Validate schema name
if (!/^[a-z0-9-]+$/.test(serviceName)) {
	console.error(
		"❌ Error: Service name must contain only lowercase letters, numbers, and hyphens",
	);
	process.exit(1);
}

const camelCaseServiceName = camelCase(serviceName);

const serviceModuleDir = join(
	process.cwd(),
	"packages",
	"api",
	"src",
	"modules",
	serviceName,
);

// Check if schema folder already exists
if (existsSync(serviceModuleDir)) {
	console.error(
		`❌ Error: Service module folder '@encre/api/${serviceName}' already exists`,
	);
	process.exit(1);
}

// Create schema folder structure
const helpersFile = join(serviceModuleDir, `${serviceName}.helpers.ts`);
const routerFile = join(serviceModuleDir, `${serviceName}.router.ts`);
const servicesBarrelFile = join(serviceModuleDir, "services", "index.ts");
const createFile = join(
	serviceModuleDir,
	"services",
	`create-${serviceName}.ts`,
);
const updateFile = join(
	serviceModuleDir,
	"services",
	`update-${serviceName}.ts`,
);
const deleteFile = join(
	serviceModuleDir,
	"services",
	`delete-${serviceName}.ts`,
);
const getOneFile = join(
	serviceModuleDir,
	"services",
	`get-one-${serviceName}.ts`,
);
const getManyFile = join(
	serviceModuleDir,
	"services",
	`get-many-${serviceName}.ts`,
);

try {
	await mkdir(serviceModuleDir, { recursive: true });

	const capitalized = capitalize(serviceName);

	const createContent = `import type {
  Create${capitalized}InputType,
  Create${capitalized}OutputType,
} from "@encre/schemas";
  
export async function create${capitalized}(
  input: Create${capitalized}InputType
): Promise<Create${capitalized}OutputType> {
  console.log("create${capitalized}", input);
  return {};
};
`;

	const updateContent = `import type {
  Update${capitalized}InputType,
  Update${capitalized}OutputType,
} from "@encre/schemas";

export async function update${capitalized}(
  input: Update${capitalized}InputType
): Promise<Update${capitalized}OutputType> {
  console.log("update${capitalized}", input);
  return {};
};
`;

	const deleteContent = `import type {
  Delete${capitalized}InputType,
  Delete${capitalized}OutputType,
} from "@encre/schemas";


export async function delete${capitalized}(input: Delete${capitalized}InputType): Promise<Delete${capitalized}OutputType> {
  console.log("delete${capitalized}", input);
  return {};
};
`;

	const getOneContent = `import type { GetOne${capitalized}InputType, GetOne${capitalized}OutputType ,
} from "@encre/schemas";

export async function getOne${capitalized}(input: GetOne${capitalized}InputType): Promise<GetOne${capitalized}OutputType> {
  console.log("getOne${capitalized}", input);
  return {};
};
`;

	const getManyContent = `import type { GetMany${capitalized}InputType, GetMany${capitalized}OutputType ,
} from "@encre/schemas";

export async function getMany${capitalized}(input: GetMany${capitalized}InputType): Promise<GetMany${capitalized}OutputType> {
  console.log("getMany${capitalized}", input);
  return [];
};
`;

	await mkdir(join(serviceModuleDir, "services"), { recursive: true });

	await writeFile(createFile, createContent);
	await writeFile(updateFile, updateContent);
	await writeFile(deleteFile, deleteContent);
	await writeFile(getOneFile, getOneContent);
	await writeFile(getManyFile, getManyContent);

	const barrelContent = `export * from "./create-${serviceName}";
export * from "./delete-${serviceName}";
export * from "./get-many-${serviceName}";
export * from "./get-one-${serviceName}";
export * from "./update-${serviceName}";
`;

	await writeFile(servicesBarrelFile, barrelContent);

	const helpersContent = "export {};";

	await writeFile(helpersFile, helpersContent);

	const routerContent = `import { publicProcedure } from "../../procedures";
import { 
  GetOne${capitalized}InputSchema, 
  GetOne${capitalized}OutputSchema, 
  GetMany${capitalized}InputSchema, 
  GetMany${capitalized}OutputSchema,
  Create${capitalized}InputSchema, 
  Create${capitalized}OutputSchema, 
  Update${capitalized}InputSchema, 
  Update${capitalized}OutputSchema, 
  Delete${capitalized}InputSchema, 
  Delete${capitalized}OutputSchema, 
} from "@encre/schemas";
import { getOne${capitalized}, getMany${capitalized}, create${capitalized}, update${capitalized}, delete${capitalized} } from "./services";

export const ${camelCaseServiceName}Router = {
  getOne${capitalized}: publicProcedure
    .input(GetOne${capitalized}InputSchema)
    .output(GetOne${capitalized}OutputSchema)
    .handler(
      async ({ input }) => await getOne${capitalized}(input),
    ),
  getMany${capitalized}: publicProcedure
    .input(GetMany${capitalized}InputSchema)
    .output(GetMany${capitalized}OutputSchema)
    .handler(
      async ({ input }) => await getMany${capitalized}(input),
    ),
  create${capitalized}: publicProcedure
    .input(Create${capitalized}InputSchema)
    .output(Create${capitalized}OutputSchema)
    .handler(
      async ({ input }) => await create${capitalized}(input),
    ),
  update${capitalized}: publicProcedure
    .input(Update${capitalized}InputSchema)
    .output(Update${capitalized}OutputSchema)
    .handler(
      async ({ input }) => await update${capitalized}(input),
    ),
  delete${capitalized}: publicProcedure
    .input(Delete${capitalized}InputSchema)
    .output(Delete${capitalized}OutputSchema)
    .handler(
      async ({ input }) => await delete${capitalized}(input),
    ),
};
`;

	await writeFile(routerFile, routerContent);

	// go to packages/api/src/modules/routers/index.ts
	// add
	// import { ${serviceName}Router } from "./${serviceName}.router";
	// inside appRouter = { ... }
	// ${serviceName}: ${serviceName}Router,
	const mainRouterFile = join(
		process.cwd(),
		"packages",
		"api",
		"src",
		"routers",
		"index.ts",
	);

	const mainRouterImportStatement = `import { ${camelCaseServiceName}Router } from "../modules/${serviceName}/${serviceName}.router";`;
	const mainRouterObjectEntry = `\t${camelCaseServiceName}: ${camelCaseServiceName}Router,`;

	let currentMainRouterContent = await readFile(mainRouterFile, "utf-8");

	if (!currentMainRouterContent.includes(mainRouterImportStatement)) {
		// 1. Add import after the last import statement
		const lastImportIndex = currentMainRouterContent.lastIndexOf("import ");
		const endOfLastImport = currentMainRouterContent.indexOf(
			"\n",
			lastImportIndex,
		);

		currentMainRouterContent =
			currentMainRouterContent.slice(0, endOfLastImport + 1) +
			mainRouterImportStatement +
			"\n" +
			currentMainRouterContent.slice(endOfLastImport + 1);

		// 2. Add router entry inside appRouter object (before the closing brace)
		// Find the last router entry (e.g., "characters: charactersRouter,")
		const appRouterMatch = currentMainRouterContent.match(
			/(\w+:\s*\w+Router,)\n(\s*}\s*;?\s*\nexport type AppRouter)/,
		);

		if (appRouterMatch) {
			const insertPosition =
				currentMainRouterContent.indexOf(appRouterMatch[0]) +
				(appRouterMatch[1]?.length ?? 0);

			currentMainRouterContent =
				currentMainRouterContent.slice(0, insertPosition) +
				"\n" +
				mainRouterObjectEntry +
				currentMainRouterContent.slice(insertPosition);
		}

		await writeFile(mainRouterFile, currentMainRouterContent);
	}

	console.log(
		`✅ Service module '@encre/api/${serviceName}' created successfully!`,
	);
	console.log("");
	console.log(`📁 Location: packages/api/src/modules/${serviceName}`);
	console.log("");
	console.log("Next steps:");
	console.log(`  1. cd packages/api/src/modules/${serviceName}`);
	console.log("  2. Start building your service in services/index.ts");
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

function camelCase(str: string) {
	return str
		.split("-")
		.map((word, index) =>
			index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
		)
		.join("");
}

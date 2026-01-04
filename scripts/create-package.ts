#!/usr/bin/env bun

import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const packageName = process.argv[2];

if (!packageName) {
	console.error("❌ Error: Package name is required");
	console.log("Usage: bun run create-package <name>");
	console.log("Example: bun run create-package mail");
	process.exit(1);
}

// Validate package name
if (!/^[a-z0-9-]+$/.test(packageName)) {
	console.error(
		"❌ Error: Package name must contain only lowercase letters, numbers, and hyphens",
	);
	process.exit(1);
}

const packageDir = join(process.cwd(), "packages", packageName);

// Check if package already exists
if (existsSync(packageDir)) {
	console.error(`❌ Error: Package '@encre/${packageName}' already exists`);
	process.exit(1);
}

// Create package structure
const srcDir = join(packageDir, "src");

try {
	// Create directories
	await mkdir(packageDir, { recursive: true });
	await mkdir(srcDir, { recursive: true });

	// Create package.json
	const packageJson = {
		name: `@encre/${packageName}`,
		exports: {
			".": "./src/index.ts",
			"./*": "./src/*.ts",
		},
		type: "module",
		private: true,
		devDependencies: {
			"@encre/config": "workspace:*",
			"@encre/env": "workspace:*",
		},
		peerDependencies: {
			typescript: "catalog:",
		},
	};

	await writeFile(
		join(packageDir, "package.json"),
		`${JSON.stringify(packageJson, null, 2)}\n`,
	);

	// Create tsconfig.json
	const tsconfig = {
		extends: "@encre/config/tsconfig.base.json",
		compilerOptions: {
			declaration: true,
			declarationMap: true,
			sourceMap: true,
			outDir: "dist",
			composite: true,
		},
	};

	await writeFile(
		join(packageDir, "tsconfig.json"),
		`${JSON.stringify(tsconfig, null, 2)}\n`,
	);

	// Create src/index.ts
	await writeFile(join(srcDir, "index.ts"), "export {};\n");

	// Create README.md
	const readme = `# @encre/${packageName}

> ${packageName.charAt(0).toUpperCase() + packageName.slice(1)} package for Encre application

## Installation

This package is part of the Encre monorepo and is installed automatically.

## Usage

\`\`\`typescript
import {} from "@encre/${packageName}";
\`\`\`

## Development

\`\`\`bash
# Install dependencies
bun install

# Type check
bun run type-check
\`\`\`
`;

	await writeFile(join(packageDir, "README.md"), readme);

	console.log("✅ Package created successfully!");
	console.log("");
	console.log(`📦 Package: @encre/${packageName}`);
	console.log(`📁 Location: packages/${packageName}`);
	console.log("");
	console.log("Next steps:");
	console.log(`  1. cd packages/${packageName}`);
	console.log("  2. Start building your package in src/index.ts");
	console.log("  3. Add dependencies if needed");
} catch (error) {
	console.error("❌ Error creating package:", error);
	process.exit(1);
}

#!/usr/bin/env bun
import { spawn } from "node:child_process";

/**
 * Usage:
 *
 * bun run create-module <module-name>
 *
 * This script creates both a schema folder and a service module with the given name.
 */
const moduleName = process.argv[2];

if (!moduleName) {
	console.error("❌ Error: Module name is required");
	console.log("Usage: bun run create-module <module-name>");
	console.log("Example: bun run create-module feedback");
	process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(moduleName)) {
	console.error(
		"❌ Error: Module name must contain only lowercase letters, numbers, and hyphens",
	);
	process.exit(1);
}

async function runScript(script: string, name: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const child = spawn("bun", ["run", script, name], {
			stdio: "inherit",
			cwd: process.cwd(),
		});

		child.on("close", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`${script} exited with code ${code}`));
			}
		});

		child.on("error", reject);
	});
}

try {
	console.log(`\n📦 Creating module '${moduleName}'...\n`);

	console.log("Step 1/2: Creating schema folder...\n");
	await runScript("create-schema", moduleName);

	console.log("\nStep 2/2: Creating service module...\n");
	await runScript("create-service", moduleName);

	console.log(`\n✅ Module '${moduleName}' created successfully!`);
	console.log("\nCreated:");
	console.log(`  📁 packages/db/prisma/schema/${moduleName}.prisma`);
	console.log(`  📁 packages/api/src/modules/${moduleName}/`);
} catch (error) {
	console.error("\n❌ Error creating module:", error);
	process.exit(1);
}
